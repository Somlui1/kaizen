# Kaizen Report (Strict Audit Standard)

## SECTION 1: The Kaizen Report (Excel-Compatible)

**Project Name:** SOS Transfer (SharePoint to API Automation)
**Project Description:** A PowerShell automation workflow that fetches SOS requests from SharePoint, transliterates Thai text to Romanized (Karaoke), sends data to the SOS API, and updates status back to SharePoint.

| **1. Reason / Kaizen Background** |
| :--- |
| **Origin of Problem:** The organization receives SOS requests via a SharePoint form, but the central Incident Management System (SOS API) requires data in a specific format (Romanized text/Cleaned Data) and does not automatically sync with SharePoint. |
| **Business Impact:** Support staff had to manually monitor SharePoint, manually transliterate Thai descriptions to English/Karaoke for system compatibility, and re-key data into the SOS system. This introduced delays, data entry errors, and encoding issues. |

| **2. Current Situation (Before State)** |
| :--- |
| **Bottlenecks/Waste (Muda):** <br>1. **Processing:** Manual data entry and manual translation of Thai text to Karaoke format. <br>2. **Waiting:** Delays between user submission on SharePoint and Ticket creation in the main system. <br>3. **Defects:** Human errors in IP address extraction and inconsistencies in Romanizing Thai names. |
| **Severity:** High latency in ticket creation. Risk of missing urgent requests if staff forgets to check SharePoint list. |

| **3. Kaizen Idea / Concept (After State)** |
| :--- |
| **Core Concept:** "End-to-End Data Bridge Automation". |
| **Methodology:** Developed a **PowerShell Script with Microsoft Graph API**. <br>1. **Auto-Fetch:** Polls SharePoint for new items. <br>2. **Smart Processing:** Auto-detects Thai text and calls a Transliteration API to convert to Karaoke. Extracts IPs/Anydesk IDs using Regex. <br>3. **Auto-Sync:** Pushes clean JSON payload to SOS API and updates SharePoint status. |
| **Root Cause Addressal:** Eliminates the manual "Middleman" role of data entry/translation by using API-to-API communication. |

| **4. Kaizen Result** |
| :--- |
| **4.1 Performance (Old vs New):** <br>- **Speed:** Process time reduced from ~5-10 mins/ticket (manual) to **<5 seconds/ticket** (script). <br>- **Accuracy:** 100% standardized Romanization and data formatting using Regex. <br>- **Integration:** Seamless sync between SharePoint and Backend API. |
| **4.2 Value Added (Non-Financial):** <br>- **Scalability:** System can handle hundreds of requests simultaneously without adding headcount. <br>- **Standardization:** Solved "Alien language" issues in legacy systems by standardizing Thai-to-English inputs. |

---

## SECTION 2: Strict Benefit Calculation (AH Standard)

*Adhering to Intigravity Standards for Financial Analysis.*

**1. Selected Category:**
*   **Main:** 1. Cost Reduction
*   **Sub-category:** Process Improvement (Eliminating Manual Data Entry & Translation).

**2. Formula Selection:**
*   **Selected Formula:** **Formula B (Man-hour Saving)**
*   **Reasoning:** The project automates a task that previously consumed staff time (Data Entry/Translation), releasing that time for other productive tasks. No headcount was removed.

**3. Calculation Parameters (Assumptions Based on Workflow):**
*   **A. Staff Involved:** 1 Person (Admin/Support)
*   **B. Salary:** 25,000 THB/month
*   **C. Working Days:** 22 days/month
*   **D. Working Hours:** 8 hours/day
*   **E. Time Saved:** Estimated **1 Hour/Day**.
    *   *Basis:* Handling daily requests, checking SharePoint, and manual translation/entry. (Approx. 12.5% of daily workload).
    *   *Monthly Calculation:* 1 hour * 22 days = **22 hours/month**.

**4. Calculation Steps:**

*   **Step 1: Calculate Hourly Cost:**
    `Salary / Days / Hours`
    `25,000 / 22 / 8` = **142.04 THB/hour**

*   **Step 2: Calculate Total Value of Time Saved:**
    `Hourly Cost * Total Hours Saved`
    `142.04 * 22` = **3,124.88 THB/month**

**5. Final Savings:**

*   **THB per Month:** **3,124.88 THB**
*   **THB per Year:** **37,498.56 THB**
