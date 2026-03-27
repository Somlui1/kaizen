# Kaizen Report (Strict Audit Standard)

## SECTION 1: The Kaizen Report (Excel-Compatible)

**Project Name:** SOS Widget App (Real-time IT Support Notification)
**Project Description:** Development of an "Always-on-Top" desktop widget using Electron/React to push real-time SOS alerts to IT staff, replacing passive dashboard monitoring.

| **1. Reason / Kaizen Background** |
| :--- |
| **Origin of Problem:** IT Support staff previously relied on a "pull" mechanism (manually checking web dashboards/emails) to identify new critical requests. |
| **Business Impact:** This passive monitoring caused delayed responses to "SOS" (high severity) tickets, leading to prolonged operational downtime for end-users and frequent context-switching inefficiency for IT staff. |

| **2. Current Situation (Before State)** |
| :--- |
| **Bottlenecks/Waste (Muda):** <br>1. **Muda of Waiting:** Time lost between incident creation and staff awareness (Reaction Latency). <br>2. **Muda of Motion:** Excessive keystrokes (Alt-Tab) and mouse clicks to refresh browser tabs ~10-20 times per hour. <br>3. **Defects:** Human error where critical tickets were missed during high-workload periods. |
| **Severity:** Average reaction time could exceed 15-30 minutes during busy periods. High cognitive load due to constant monitoring anxiety. |

| **3. Kaizen Idea / Concept (After State)** |
| :--- |
| **Core Concept:** Shift from "Passive Monitoring" to "Active Alerting". |
| **Methodology:** Implemented an **Electron-based Desktop Widget** with **Always-on-Top** architecture. |
| **Root Cause Addressal:** by forcing the notification to the visual foreground (red blinking border, pulse animation), the system removes the dependency on human memory to "check" for work. |

| **4. Kaizen Result** |
| :--- |
| **4.1 Performance (Old vs New):** <br>- **Speed:** Reaction time reduced from ~15 mins to <3 mins (max auto-refresh cycle). <br>- **Accuracy:** Missed critical tickets reduced to 0% due to visual intrusion of the widget. <br>- **Process:** Eliminated manual page refreshes entirely (100% automation of monitoring). |
| **4.2 Value Added (Non-Financial):** <br>- **Risk Reduction:** Prevents minor IT issues from escalating into major outages due to delay. <br>- **Satisfaction:** Reduced staff fatigue from "monitoring anxiety". |

---

## SECTION 2: Strict Benefit Calculation (AH Standard)

*Adhering to Intigravity Standards for Financial Analysis.*

**1. Selected Category:**
*   **Main:** 1. Cost Reduction
*   **Sub-category:** Process Improvement (Eliminating non-value-added motion and waiting time).

**2. Formula Selection:**
*   **Selected Formula:** **Formula B (Man-hour Saving)**
*   **Reasoning:** The project does not immediately reduce headcount (Formula A), but it recovers significant productive time previously lost to manual monitoring/switching windows. This recovered time is converted into productive work hours.

**3. Calculation Parameters (Assumptions Based on Standard IT Role):**
*   **A. Staff Count:** 1 Person (Multiplier)
*   **B. Salary:** 25,000 THB/month
*   **C. Working Days:** 22 days/month
*   **D. Working Hours:** 8 hours/day
*   **E. Time Saved:** 5 minutes/hour (conservative estimate of time spent switching windows/checking dashboard).
    *   *Daily Calculation:* 5 mins * 8 hours = 40 mins/day.
    *   *Monthly Calculation:* 40 mins * 22 days = 880 mins = **14.66 hours/month**.

**4. Calculation Steps:**

*   **Step 1: Calculate Hourly Cost:**
    `Salary / Days / Hours`
    `25,000 / 22 / 8` = **142.04 THB/hour**

*   **Step 2: Calculate Total Value of Time Saved (Per Person):**
    `Hourly Cost * Total Hours Saved`
    `142.04 * 14.66` = **2,082.30 THB/month**

**5. Final Savings (Per Person):**

*   **THB per Month:** **2,082.30 THB**
*   **THB per Year:** **24,987.60 THB**

*(Note: To get the total project saving, multiply the Final Savings by the actual number of IT Support staff using the widget.)*
