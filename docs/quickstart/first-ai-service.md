---
sidebar_position: 2
---

# Run your first AI service locally

This walks you through the AgriFoodData **Starter Kit** — from install to a
running service that ingests data, processes it, and writes results back.

## Prerequisites

- **OS** — Windows, macOS, or Linux
- **Python** 3.10+
- **Docker** 20.10+
- **Git** (recommended)

Verify:

```bash
python --version    # Python 3.10.x or higher
docker --version    # Docker version 20.10.x or higher
```

## 1. Install the AgriFoodData SDK

```bash
pip install git+https://github.com/NaLamKI/SDK
pip show nalamkisdk
```

> The SDK repo and the import name will move to `agrifooddata` as part
> of the ongoing rebrand — see the [Roadmap](../ecosystem/roadmap.md).

## 2. Clone the AgriFoodData Starter Kit

```bash
git clone https://github.com/NaLamKI/Starterkit.git
cd Starterkit
```

## 3. Set up a virtualenv and install

```bash
python -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate             # Windows
pip install -r src/requirements.txt
```

## 4. Run the example service

The default starter detects green colours in images — a placeholder for a
real vegetation/crop model.

```bash
python test/test.py
```

Inputs are read from `test/action/input/`, outputs land in
`test/action/output/`.

To visualise the outputs:

```bash
python src/visualize_outputs.py
```

## 5. What just happened

1. The service loads images from `test/action/input/`.
2. It processes each image (here: green-pixel detection).
3. It writes results to `test/action/output/`.
4. The visualisation script renders them.

## Project structure

```
StarterKit/
├── src/                       # Your service code
│   ├── service.py             # Main service class
│   ├── requirements.txt
│   └── visualize_outputs.py
├── test/                      # Local test harness
│   ├── service.py
│   ├── test.py
│   └── action/
│       ├── input/
│       └── output/
└── Dockerfile
```

## Next steps

- [Build · AI Services](../build/ai-services/overview.md) — make this service production-ready
- [Concepts · Service Registry](../concepts/service-registry.md) — how the service is registered, commissioned and audited
- [Examples · Apple Yield Detection](../examples/apple-yield.md) — a complete real-world implementation
