## Moving from a single-threaded script to an asynchronous, distributed system using a **Job Queue**.

## You are the developer - create a task list based on the following directions and carry out the tasks in order to completion.

### Your `server/orchestrator.js` file is the perfect place to manage this. Instead of doing the work itself, its job is to break the simulation down into thousands of small, individual tasks and hand them off to dedicated "worker" processes.

---

### Conceptual Overview: The Restaurant Kitchen Analogy

Think of your current system as a single chef trying to cook a 50-person dinner party alone. The first few dishes come out on time, but by the end, everything is late.

The Job Queue model turns your server into a professional kitchen:
* **The UI Request** is the customer placing an order.
* **The `orchestrator.js`** is the **Head Chef**. It doesn't cook. It takes the order, breaks it down into individual steps (chop vegetables, sear steak), and puts those steps onto a ticket rail.
* **The Job Queue (e.g., Redis with BullMQ)** is the **Ticket Rail**. It holds all the jobs in an organized way, including when they need to be started.
* **Worker Processes** are the **Line Cooks**. Each cook grabs one ticket from the rail, does that one specific task, and then is free to grab the next. You can have many line cooks working in parallel.
* **The Database** is the **Recipe Book**. It stores the state of the overall order (simulation) so any cook can see what's been done and what's left.

---

### Developer Plan: Implementing the Orchestration

Here’s the 411 for the developer on how to build this out, focusing on the backend.

#### 1. The Database is the Source of Truth

The developer needs to create a `simulations` table in your database to track the state of every job. Use a new migration file in your `migrations` directory.

**`simulations` Table Schema:**

| Column                | Type      | Notes                                                              |
| :-------------------- | :-------- | :----------------------------------------------------------------- |
| `id`                  | UUID      | Primary Key.                                                       |
| `user_id`             | UUID      | Foreign key to the user who started it.                            |
| `status`              | String    | e.g., 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED'.                  |
| `start_time`          | Timestamp | When the simulation is scheduled to begin.                         |
| `end_time`            | Timestamp | When the simulation is scheduled to end.                           |
| `scenario`            | String    | 'B2B' or 'B2C'.                                                    |
| `distribution_method` | String    | 'Linear', 'Bell Curve', etc.                                       |
| `total_records`       | Integer   | The total number of primary records to create.                     |
| `records_processed`   | Integer   | A counter for tracking progress, updated by the workers.           |
| `created_at`          | Timestamp | When the simulation was first configured.                          |
| `updated_at`          | Timestamp | When the simulation's status or progress was last updated.         |

#### 2. Implement a Job Queue

The developer should integrate a robust job queue library. **BullMQ** is a modern, highly recommended choice that uses Redis (which is fast and scalable).

**Action:** Add `bullmq` and `redis` to your `package.json` dependencies.

#### 3. Refactor `orchestrator.js` (The Head Chef)

This file will no longer directly call the HubSpot tools. Instead, it will calculate all the jobs upfront and schedule them.

**`orchestrator.js` Logic:**

1.  **`startSimulation(simulationId)` function:**
    * This is called by your main server `index.js` when a user starts a simulation.
    * It reads the simulation's configuration from the new `simulations` database table.
    * It **loops** from 1 to `total_records`.
    * Inside the loop, it performs a crucial calculation: **It determines the precise timestamp for *every single record creation event*** based on the `distribution_method`, `start_time`, and `end_time`.
    * For each event, it adds a "job" to the BullMQ queue. The job contains the data needed to create the record (e.g., `{ type: 'B2B_CREATION_EVENT' }`).
    * **Crucially, it adds a `delay` option to the job.** This delay is the calculated difference between `now` and the event's scheduled timestamp. This tells the queue *not* to release the job to a worker until that specific time.

This solves your timing problem. The system pre-calculates everything and uses the queue to handle the waiting, ensuring records are created at the correct time, regardless of system load.

#### 4. Create a `worker.js` Process (The Line Cooks)

The developer needs to create a new, separate Node.js process. This file is *not* part of your main web server. You will run multiple instances of this process in the background.

**`worker.js` Logic:**

1.  It connects to the same Redis instance and listens to the job queue.
2.  It sits idle until a job becomes available (i.e., its delay has passed).
3.  When it receives a job (e.g., `{ type: 'B2B_CREATION_EVENT' }`), it executes the logic from **Phase 1**:
    * Calls the AI model to get creative data.
    * Uses the HubSpot tools (`companies.create`, `contacts.create`, `associations.create`) to create the records in HubSpot.
    * After a successful API call, it updates the database by incrementing the `records_processed` counter for that simulation.
    * If all records are processed, it updates the simulation `status` to 'COMPLETED'.

This architecture scales horizontally. If simulations are running slow, you simply run more `worker.js` processes without touching the main web server or orchestrator.