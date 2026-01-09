# TiDB Event Streaming Pipeline

A real-time Change Data Capture (CDC) pipeline leveraging TiDB, TiCDC, and Kafka.
This project simulates a distributed database environment that streams row-level changes to a message broker for downstream consumption.

## Architecture

**Flow:** `TiDB (SQL)` -> `TiKV (Storage)` -> `TiCDC (Capture)` -> `Kafka (Broker)`

### Services
* **TiDB:** Distributed SQL Database (MySQL Compatible).
* **TiKV:** Distributed Key-Value Storage engine.
* **PD (Placement Driver):** Cluster manager and metadata store.
* **TiCDC:** Change Data Capture tool for replicating changes to other systems.
* **Kafka:** Event streaming platform (using Confluent image).
* **Zookeeper:** Coordinator for Kafka.

## Prerequisites

* Docker
* Docker Compose
* *Note:* Optimized for Apple Silicon (M-series processor) architecture.

## Getting Started

1.  **Start the infrastructure:**
    ```bash
    docker-compose up -d
    ```

2.  **Verify services are running:**
    ```bash
    docker-compose ps
    ```
    *Ensure all 6 containers are in `Up` / `Running` state.*

3.  **Initialize the Changefeed (One-time setup):**
    Connect TiCDC to Kafka to start the replication task:
    ```bash
    docker-compose exec ticdc \
      /cdc cli changefeed create \
      --server=http://ticdc:8300 \
      --sink-uri="kafka://kafka:9092/tidb-test?protocol=canal-json" \
      --changefeed-id="simple-replication-task"
    ```

## 🔌 Port Configuration

| Service   | Local Port | Internal Port | Description |
|-----------|------------|---------------|-------------|
| TiDB      | `4000`     | `4000`        | SQL Interface |
| PD        | `2379`     | `2379`        | Cluster Manager |
| TiCDC     | `8300`     | `8300`        | CDC Management |
| Kafka     | `9092`     | `9092`        | Kafka Broker |