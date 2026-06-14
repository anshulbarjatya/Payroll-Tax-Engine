# Salary Structure Module

Define CTC-to-component templates and preview salary breakdowns.

## Endpoints

| Method | Path                              | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/salary-structures`              | Create salary structure        |
| GET    | `/salary-structures/breakdown`    | Get component-wise breakdown   |

Component types: `percentage_of_ctc`, `percentage_of_basic`, `fixed`, `balancing_figure`.
