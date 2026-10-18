[X Skills](https://github.com/hepzanechen/x-skills) is a public collection of agent skills and supporting tools. It turns easily overlooked research steps into explicit workflows for coding agents that can read instructions and run commands.

The project is still a prototype. A workflow can organize an investigation; it cannot guarantee that its conclusions are correct.

## Causal graphs: preserve the path to a claim

`causal-graph-research` records raw evidence, facts, deductions, and causal relationships separately. A Python CLI owns graph mutations and Bayesian calculations so that an investigation can be inspected and revised.

The workflow asks both whether an explanation is plausible and whether alternatives have been seriously considered. Before a causal claim can cross the high-confidence threshold, it requires a recorded falsification check.

Confidence still depends on the evidence and modeling assumptions supplied. A computed number cannot substitute for a thorough evidence search.

## Statistical thinking: define what to estimate

The new `statistical-thinking` skill begins with the target population, sample, observation unit, and measurements. It then defines the estimand, study design, and analysis method.

Before comparing two approaches, for example: what counts as an independent observation? Is the target an average difference or a difference in event probabilities? How large must a difference be to justify action?

Those questions determine what an analysis means. The skill also covers uncertainty, missing data, multiple comparisons, diagnostics, and sensitivity analysis.

## Connections and next steps

Two companion skills address learning and action:

- `concept-connections` uses a few useful comparisons and analogies to explain relationships and boundaries between concepts.
- `aha-opportunity-scout` looks for a low-cost next step supported by the evidence after the immediate task is complete.

These skills can be combined as needed. A simple question needs a simple process; a complex investigation may benefit from a fuller record.

## Where to begin

Start with the [repository README](https://github.com/hepzanechen/x-skills#readme), then open the relevant skill in `skills/`. Try it on a concrete task and check whether it makes the relationship between questions, evidence, and conclusions easier to explain.
