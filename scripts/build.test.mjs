import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const posts=JSON.parse(fs.readFileSync('content/posts.json','utf8'));
const read=p=>fs.readFileSync(path.join('dist',p),'utf8');
test('each article has a complete translation and reciprocal language link',()=>{
 const slugs=new Set();
 for(const p of posts){
  assert.match(p.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert(!slugs.has(p.slug));slugs.add(p.slug);
  for(const lang of ['zh','en']){
   assert(p[lang].title && p[lang].summary);
   assert(fs.readFileSync(`content/${p.slug}.${lang}.md`,'utf8').length>100);
   const base=lang==='zh'?'':'en/';const other=lang==='zh'?'/en/':'/';
   const html=read(`${base}posts/${p.slug}/index.html`);
   assert(html.includes(`href="${other}posts/${p.slug}/"`));
   assert(html.includes(`lang="${lang==='zh'?'zh-CN':'en'}"`));
  }
 }
});
test('all generated internal navigation and asset paths resolve',()=>{
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
 for(const file of walk('dist').filter(f=>f.endsWith('.html'))){
  const html=fs.readFileSync(file,'utf8');
  for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)){
   const target=path.join('dist',url.endsWith('/')?url+'index.html':url);
   assert(fs.existsSync(target),`${file}: broken link ${url}`);
  }
 }
});
test('feeds contain every published article in the correct language',()=>{
 for(const lang of ['zh','en']){
  const feed=read(lang==='zh'?'feed.xml':'en/feed.xml');
  assert.equal((feed.match(/<item>/g)||[]).length,posts.length);
  for(const p of posts)assert(feed.includes(`${lang==='zh'?'':'/en'}/posts/${p.slug}/`));
 }
});

test('Mermaid fences become renderable diagrams only on diagram pages',()=>{
  for(const lang of ['','en/']){
    const article=read(`${lang}posts/evaluating-ai-scientific-exploration/index.html`);
    assert.match(article,/<div class="mermaid">/);
    assert.match(article,/mermaid\.esm\.min\.mjs/);
  }
  assert.doesNotMatch(read('index.html'),/mermaid\.esm\.min\.mjs/);
});

test('article pages include Giscus comments and reactions',()=>{
  for(const lang of ['','en/']){
    const article=read(`${lang}posts/evaluating-ai-scientific-exploration/index.html`);
    assert.match(article,/https:\/\/giscus\.app\/client\.js/);
    assert.match(article,/data-reactions-enabled="1"/);
    assert.match(article,/data-repo-id="R_kgDOJgmsWg"/);
    assert.match(article,/data-category-id="DIC_kwDOJgmsWs4DI5ok"/);
  }
  assert.doesNotMatch(read('index.html'),/giscus\.app\/client\.js/);
});


test('the scientific exploration article carries its GPT-6.1 co-author credit',()=>{
  assert.match(read('posts/evaluating-ai-scientific-exploration/index.html'),/与 GPT-6\.1 合作撰写/);
  assert.match(read('en/posts/evaluating-ai-scientific-exploration/index.html'),/Co-written by GPT-6\.1/);
});
