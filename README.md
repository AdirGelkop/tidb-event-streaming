# TiDB Event Streaming Pipeline

Real-time Change Data Capture (CDC) pipeline that captures row-level changes from a distributed TiDB cluster and streams them to Apache Kafka using the Canal-JSON protocol.

## Architecture

```
TiDB (SQL Interface) → TiKV (Storage) → TiCDC (Capture) → Kafka (Broker) → [Planned] Node.js Consumer
```

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| **1. Infrastructure** | Docker Compose stack, ARM64 compatibility, Changefeed setup | ✅ Done |
| **2. Application** | Node.js Kafka consumer, E2E testing | 🚧 Pending |

## Services

| Service | Port | Role |
|---------|------|------|
| **TiDB** | 4000 | SQL Layer (MySQL Compatible) |
| **PD** | 2379 | Cluster Metadata & Orchestration |
| **TiKV** | 20160 | Distributed Key-Value Store |
| **TiCDC** | 8300 | Change Data Capture Engine |
| **Kafka** | 9092 | Event Streaming Broker |
| **Zookeeper** | 2181 | Kafka Coordinator |

## Quick Start

**1. Start the stack**
```bash
docker-compose up -d
```

**2. Verify all containers are running**
```bash
docker-compose ps
```

**3. Create the Changefeed (run once)**
```bash
docker-compose exec ticdc \
  /cdc cli changefeed create \
  --server=http://ticdc:8300 \
  --sink-uri="kafka://kafka:9092/tidb-test?protocol=canal-json" \
  --changefeed-id="simple-replication-task"
```

**4. Verify Changefeed status**
```bash
docker-compose exec ticdc /cdc cli changefeed list --server=http://ticdc:8300
```

The changefeed should report `normal` state.

## Tech Stack

- **Database:** TiDB (PD + TiKV + TiDB)
- **CDC:** TiCDC with Canal-JSON protocol
- **Messaging:** Apache Kafka + Zookeeper
- **Platform:** Docker Compose, ARM64/Apple Silicon compatible