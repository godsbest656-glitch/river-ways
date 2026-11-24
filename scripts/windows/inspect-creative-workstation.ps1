# River Ways creative workstation inventory
# Read-only. Does not install, update, launch, or modify software.
[CmdletBinding()]
param()

$ErrorActionPreference = 'SilentlyContinue'

function Get-CommandVersion([string]$Name, [string[]]$Arguments = @('--version')) {
    $cmd = Get-Command $Name -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $cmd) { return $null }
    $version = $null
    try { $version = (& $cmd.Source @Arguments 2>&1 | Select-Object -First 1).ToString().Trim() } catch {}
    return [ordered]@{ path = $cmd.Source; version = $version }
}

function Get-AppRecord([string]$Name, [string[]]$Candidates) {
    foreach ($candidate in $Candidates) {
        if (Test-Path -LiteralPath $candidate) {
            $item = Get-Item -LiteralPath $candidate
            return [ordered]@{
                name = $Name
                installed = $true
                path = $item.FullName
                fileVersion = $item.VersionInfo.FileVersion
                productVersion = $item.VersionInfo.ProductVersion
            }
        }
    }
    return [ordered]@{ name = $Name; installed = $false }
}

$programFiles = @($env:ProgramFiles, [Environment]::GetEnvironmentVariable('ProgramFiles(x86)')) | Where-Object { $_ }
$os = Get-CimInstance Win32_OperatingSystem
$computer = Get-CimInstance Win32_ComputerSystem
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
$disks = @(Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' | ForEach-Object {
    [ordered]@{ drive = $_.DeviceID; sizeBytes = $_.Size; freeBytes = $_.FreeSpace }
})
$gpus = @(Get-CimInstance Win32_VideoController | ForEach-Object {
    [ordered]@{ name = $_.Name; driverVersion = $_.DriverVersion; adapterRamBytes = $_.AdapterRAM }
})

$adobeApps = @(
    (Get-AppRecord 'Photoshop' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe Photoshop 2026/Photoshop.exe'; Join-Path $_ 'Adobe/Adobe Photoshop 2025/Photoshop.exe' }))
    (Get-AppRecord 'Illustrator' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe Illustrator 2026/Support Files/Contents/Windows/Illustrator.exe'; Join-Path $_ 'Adobe/Adobe Illustrator 2025/Support Files/Contents/Windows/Illustrator.exe' }))
    (Get-AppRecord 'Premiere Pro' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe Premiere Pro 2026/Adobe Premiere Pro.exe'; Join-Path $_ 'Adobe/Adobe Premiere Pro 2025/Adobe Premiere Pro.exe' }))
    (Get-AppRecord 'After Effects' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe After Effects 2026/Support Files/AfterFX.exe'; Join-Path $_ 'Adobe/Adobe After Effects 2025/Support Files/AfterFX.exe' }))
    (Get-AppRecord 'InDesign' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe InDesign 2026/InDesign.exe'; Join-Path $_ 'Adobe/Adobe InDesign 2025/InDesign.exe' }))
    (Get-AppRecord 'Media Encoder' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe Media Encoder 2026/Adobe Media Encoder.exe'; Join-Path $_ 'Adobe/Adobe Media Encoder 2025/Adobe Media Encoder.exe' }))
    (Get-AppRecord 'Creative Cloud Desktop' ($programFiles | ForEach-Object { Join-Path $_ 'Adobe/Adobe Creative Cloud/ACC/Creative Cloud.exe' }))
    (Get-AppRecord 'UXP Developer Tool' ($programFiles | ForEach-Object { Join-Path $_ 'Common Files/Adobe/UXPDeveloperTool/UXPDeveloperTool.exe' }))
)

$tools = [ordered]@{
    node = Get-CommandVersion 'node'
    npm = Get-CommandVersion 'npm'
    python = Get-CommandVersion 'python'
    git = Get-CommandVersion 'git'
    ffmpeg = Get-CommandVersion 'ffmpeg'
    ffprobe = Get-CommandVersion 'ffprobe'
    blender = Get-CommandVersion 'blender'
}

$inventory = [ordered]@{
    schemaVersion = '1.0'
    collectedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
    collectionMode = 'read-only'
    computer = [ordered]@{
        name = $env:COMPUTERNAME
        manufacturer = $computer.Manufacturer
        model = $computer.Model
        totalPhysicalMemoryBytes = $computer.TotalPhysicalMemory
    }
    operatingSystem = [ordered]@{
        caption = $os.Caption
        version = $os.Version
        buildNumber = $os.BuildNumber
        architecture = $os.OSArchitecture
    }
    processor = [ordered]@{
        name = $cpu.Name
        cores = $cpu.NumberOfCores
        logicalProcessors = $cpu.NumberOfLogicalProcessors
    }
    graphics = $gpus
    fixedDisks = $disks
    adobeApplications = $adobeApps
    developerTools = $tools
    notes = @(
        'No software was installed, updated, launched or modified.'
        'No credentials, environment variable values, client files or personal documents were collected.'
        'App detection checks common Adobe installation paths. Confirm unusual or custom paths manually.'
        'Review this report before sharing it outside the River Ways engineering workflow.'
    )
}

$inventory | ConvertTo-Json -Depth 8
