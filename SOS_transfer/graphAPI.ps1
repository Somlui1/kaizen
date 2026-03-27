
<#
    .SYNOPSIS
        Simple SOS Workflow - Fetch from SharePoint -> Send to API -> Update SharePoint
    .VERSION
        2.0.0 (Simplified & Refactored)
#>

# --- 1. CONFIGURATION & SETUP ---
$ErrorActionPreference = "Stop"

# พยายามตั้งค่า Console ให้รองรับภาษาไทย (ถ้าทำไม่ได้ให้ข้ามไป ไม่ให้ Script พัง)
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

# --- 2. HELPER FUNCTIONS ---

function Get-TechInfo {
    <#
    .SYNOPSIS
        Extracts IP address and Anydesk ID from a given text.
    .DESCRIPTION
        This function scans the input text for IPv4 addresses and Anydesk IDs (9-10 digits).
        Returns the result with "tag:raw " prefix.
    .PARAMETER Text
        The text to analyze.
    #>
    param (
        [string]$Text
    )

    try {
        if ([string]::IsNullOrEmpty($Text)) {
            return "Unknown: $Text"
        }

        # Regex for IPv4
        $ipPattern = "\b(?:\d{1,3}\.){3}\d{1,3}\b"
        # Regex for Anydesk (9-10 digits)
        $anydeskPattern = "\b\d{9,10}\b"

        $ipMatch = [regex]::Match($Text, $ipPattern)
        $anydeskMatch = [regex]::Match($Text, $anydeskPattern)

        $ip = $null
        $anydesk = $null

        if ($ipMatch.Success) {
            $ip = $ipMatch.Value
        }

        if ($anydeskMatch.Success) {
            $anydesk = $anydeskMatch.Value
        }

        if ($ip -and $anydesk) {
            return "Combined: IP $ip / Anydesk $anydesk"
        }
        elseif ($ip) {
            return "IP: $ip"
        }
        elseif ($anydesk) {
            return "Anydesk: $anydesk"
        }
        else {
            return "Unknown: $Text"
        }
    }
    catch {
        # Catch-all for any unexpected errors
        return "Unknown: $Text"
    }
}

function Write-Log ($Message, $Color = "Cyan") {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Clean-Data ($InputString) {
    if ([string]::IsNullOrWhiteSpace($InputString)) { return "-" }
    # ลบช่องว่างส่วนเกินและ Trim
    return ($InputString -replace '\s+', ' ').Trim()
}

function Get-LanguageType {
    param([string]$Text)
    $hasThai = $Text -match '[\u0E00-\u0E7F]'
    $hasEnglish = $Text -match '[a-zA-Z]'

    if ($hasThai -and $hasEnglish) { return "Mixed (Thai/English)" }
    if ($hasThai) { return "Thai" }
    if ($hasEnglish) { return "English" }
    return "Other"
}

function Get-ThaiToKaraoke {
    <#
    .SYNOPSIS
        Send request to transliterate Thai to Karaoke (Romanized)
    .EXAMPLE
        Get-ThaiToKaraoke -Text "สวัสดี"
    #>
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true, Position = 0)]
        [string]$Text,

        [Parameter(Position = 1)]
        [string]$Engine = "royin",

        [string]$Url = "http://localhost:8000/transliterate/thai-to-karaoke/"
    )

    # Convert body to JSON
    $Body = @{
        text   = $Text
        engine = $Engine
    } | ConvertTo-Json -Compress

    try {
        # Execute Request
        $Response = Invoke-RestMethod -Uri $Url `
            -Method Post `
            -Body $Body `
            -ContentType "application/json; charset=utf-8" `
            -ErrorAction Stop
        
        return $Response
    }
    catch {
        Write-Error "API Connection Error: $_"
    }
}

function Send-SOSToApi {
    param (
        [string]$ApiUrl,
        [hashtable]$Payload
    )
    try {
        # 1. แปลงข้อมูลเป็น JSON String ตามปกติ
        $jsonBody = $Payload | ConvertTo-Json -Depth 5 -Compress 
        # 2. [แก้ปัญหาภาษาเพี้ยน] ใช้ UTF-8 แบบไม่มี BOM (Signature)
        # PowerShell บางทีส่ง BOM ไปด้วยทำให้ API บางตัวอ่านเพี้ยนเป็น ANSI
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        $utf8Bytes = $utf8NoBom.GetBytes($jsonBody)

        # 3. กำหนด Headers ให้ชัดเจนว่าเป็น UTF-8
        $headers = @{
            "Content-Type" = "application/json; charset=utf-8"
        }
        # 4. ยิง API (ใช้ -Headers แทน -ContentType เพื่อความชัวร์ที่สุด)
        $response = Invoke-RestMethod -Uri $ApiUrl -Method Post -Body $utf8Bytes -Headers $headers -ErrorAction Stop
        # ตรวจสอบผลลัพธ์
        if ($response.status -eq "success") {
            return @{ Success = $true; Msg = "OK" }
        }
        else {
            return @{ Success = $false; Msg = "API Error: $($response | Out-String)" }
        }
    }
    catch {
        $errDetail = $_.Exception.Message
        try {
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errDetail += " | Detail: " + $reader.ReadToEnd()
            }
        }
        catch {}
        
        return @{ Success = $false; Msg = $errDetail }
    }
}

# --- 3. INITIALIZATION ---

Write-Log "Starting Script..." "Green"

# โหลด Config
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '=') {
            $k, $v = $_.Split('=', 2)
            Set-Variable -Name $k.Trim() -Value $v.Trim() -Scope Script
        }
    }
}

# ตรวจสอบตัวแปรสำคัญ
if (-not $CLIENT_ID -or -not $SITE_ID) {
    Write-Log "Error: Missing configuration in .env" "Red"
    exit
}

if (-not $SOS_API_BASE_URL) { $SOS_API_BASE_URL = "http://10.10.3.215:8181" }

# --- 4. MAIN PROCESS ---

try {
    # Connect Graph
    Write-Log "Connecting to Microsoft Graph..."
    Connect-MgGraph -ClientId $CLIENT_ID -TenantId $TENANT_ID -CertificateThumbprint $CERTIFICATE_THUMBPRINT -NoWelcome | Out-Null
    
    # ดึงข้อมูลจาก SharePoint
    $filterDate = $filterDate#(Get-Date).AddDays(-1) #
    $siteParams = @{ SiteId = $SITE_ID; ListId = $SOS_LIST_ID }
    
    Write-Log "Fetching items created after $filterDate..."
    $allItems = Get-MgSiteListItem @siteParams -ExpandProperty "fields" -All
    
    # Filter เฉพาะที่ยังไม่ได้ส่ง SOS
    $pendingItems = $allItems | Where-Object { 
        $props = $_.Fields.AdditionalProperties
        ($props['is_sos_requested'] -ne 'Yes' -or $props['is_sos_requested'] -eq $null) -and $_.CreatedDateTime -ge $filterDate
    }

    Write-Log "Found $(if($pendingItems){$pendingItems.Count}else{0}) items to process." "Yellow"

    if ($pendingItems) {
        foreach ($item in $pendingItems) {
            
            $id = $item.Id
            $fields = $item.Fields.AdditionalProperties
            # เตรียมข้อมูล (Clean Data)
            $name = Clean-Data $fields['Name']
            $msg = Clean-Data $fields['Problemdetails']
            $email = Clean-Data $fields['Email']
            # --- [เพิ่มส่วนนี้] ตรวจสอบภาษาและแปลงข้อความ ---
            
            $rawDept = Clean-Data $fields['Department'] 
            
            $dept = $rawDept | ForEach-Object {
                $cleanedText = $_ 
                # เช็คภาษา
                $lang = Get-LanguageType -Text $cleanedText
                # ใช้ -match 'Thai' จะครอบคลุมทั้ง "Thai" และ "Mixed (Thai/English)"
                if ($lang -match "Thai") {
                    Write-Log "Detected Thai text ($cleanedText). Converting to Karaoke..."
                    try {
                        # เรียกแปลงภาษา
                        $karaoke = Get-ThaiToKaraoke -Text $cleanedText
                        # ตรวจสอบว่าได้ object กลับมาจริงไหม และมี property transliteration ไหม
                        if ($karaoke -and $karaoke.romanized) {
                            $karaoke.romanized
                        }
                        else {
                            Write-Log "Warning: Empty 'romanized' result. Using original text." "Yellow"
                            $cleanedText
                        }
                    }
                    catch {
                        # ถ้าฟังก์ชัน Get-ThaiToKaraoke พัง ให้ใช้ค่าเดิม (Fail-safe)
                        Write-Log "Warning: Transliteration failed. Using original text." "Yellow"
                        $cleanedText
                    }
                }
                else {
                    # ถ้าไม่ใช่ไทย ให้ส่งค่าเดิม ($cleanedText) ออกไป
                    $cleanedText
                }
            }
            # ------------------------------------------------

            $tel = Clean-Data $fields['Phonenumber']
            $comp = Clean-Data $fields['Company']
            $ipRaw = $fields['IPAddress_x002f_AnydeskCode']
            $createdDate = $fields.Created
            
            Write-Log "Processing ID: $id | User: $name"

            # เรียก function เก่าของคุณ (Get-TechInfo) ถ้ามี
            if (Get-Command "Get-TechInfo" -ErrorAction SilentlyContinue) {
                $ips = Clean-Data (Get-TechInfo -Text $ipRaw)
            }
            else {
                $ips = Clean-Data $ipRaw
            }
            # สร้าง Payload
            $payload = @{
                sos_message    = "[Site-Item #$id] $createdDate : $msg"
                requestor_name = $name
                email          = $email
                dept           = $dept
                tel            = $tel
                location       = $comp
                company        = "SR"
                ips            = $ips
            }
            # --- เรียกใช้ Function ยิง API ---
            $apiResult = Send-SOSToApi -ApiUrl "$SOS_API_BASE_URL/SOS/report-issue" -Payload $payload

            if ($apiResult.Success) {
                Write-Log "  -> API Success." "Green"
                
                # Update SharePoint
                try {
                    Update-MgSiteListItem @siteParams -ListItemId $id -Fields @{ is_sos_requested = "Yes" } -ErrorAction Stop
                    Write-Log "  -> SharePoint Updated." "Green"
                }
                catch {
                    Write-Log "  -> Failed to update SharePoint: $($_.Exception.Message)" "Red"
                }
            }
            else {
                Write-Log "  -> API Failed: $($apiResult.Msg)" "Red"
            }
        }
    }

}
catch {
    Write-Log "Fatal Error: $($_.Exception.Message)" "Red"
}
finally {
    Write-Log "Job Completed." "Green"
}