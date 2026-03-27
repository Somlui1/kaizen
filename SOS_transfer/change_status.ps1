

#+=================+
#|  SharePoint Data |
#+=================+
# Ensure your App Registration and Certificate have 'Sites.Read.All' permission.
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '=') {
            $k, $v = $_.Split('=', 2)
            Set-Variable -Name $k.Trim() -Value $v.Trim() -Scope Script
        }
    }
}
# 1. Search for a SharePoint Site by ID (Correct Method)
$TargetGuid = "a13b4ea4-75bc-435d-9af8-e9e824d1a11b" 
Write-Host "Searching for Site with ID containing: $TargetGuid" -ForegroundColor Cyan
Connect-MgGraph -ClientId $CLIENT_ID -TenantId $TENANT_ID -CertificateThumbprint $CERTIFICATE_THUMBPRINT -NoWelcome | Out-Null
# Fetch all sites and filter by ID match
# Graph ID format is usually: "hostname.sharepoint.com,SITE-GUID,WEB-GUID"
$TargetSite = Get-MgSite -All | Where-Object { $_.Id -match $TargetGuid } | Select-Object -First 1

if ($TargetSite) {
    Write-Host "FOUND SITE!" -ForegroundColor Green
    Write-Host "------------------------------------------------"
    Write-Host "Display Name : $($TargetSite.DisplayName)"
    Write-Host "Graph Site ID: $($TargetSite.Id)"
    Write-Host "Web URL      : $($TargetSite.WebUrl)"
    Write-Host "------------------------------------------------"ง


    $SiteId = $TargetSite.Id

    # 1. ดึงรายการ Lists และ Document Libraries ทั้งหมดใน Site นี้
    Write-Host "`n[1] Fetching all Lists/Libraries..." -ForegroundColor Cyan
    $AllLists = Get-MgSiteList -SiteId $SiteId
    # แสดงตารางรายชื่อ Library ทั้งหมด
    $AllLists | Select-Object DisplayName, Id | Format-Table -AutoSize

    $allListItems = Get-MgSiteListItem @siteParams -ExpandProperty "fields" -All
    $SiteId = $TargetSite.Id
    $SOSListId = "1b738bdd-7783-4103-8314-0faab58c5ff2" 
    $siteParams = @{ SiteId = $SiteId; ListId = $SOSListId }
    Write-Host "`nExtracting System Operation Service (SOS) Data..." -ForegroundColor Cyan

    $allListItems = Get-MgSiteListItem @siteParams -ExpandProperty "fields" -All
    $day = '2026-02-01T00:00:00Z'
    # 3. Filter Items
    $targetItems = $allListItems | Where-Object { 
        $_.CreatedDateTime -ge $day #-and $_.Fields.AdditionalProperties.is_sos_requested -ne 'Yes'
    }

    $count = if ($targetItems) { $targetItems.Count } else { 0 }
    Write-Host "Found $count items to process." -ForegroundColor Yellow

}

$SiteId = "aapico.sharepoint.com,a13b4ea4-75bc-435d-9af8-e9e824d1a11b,ca64f348-947d-4009-9b67-95a1d318260a"
$SOSListId = "1b738bdd-7783-4103-8314-0faab58c5ff2"
foreach ($item in $targetItems) {
    Update-MgSiteListItem -SiteId $SiteId  -ListId $SOSListId -ListItemId $item.Id -Fields @{ "is_sos_requested" = 'No' }
}
