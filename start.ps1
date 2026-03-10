<#
  Mafia AI Arena — Dev Launch Script
  Verifies dependency versions, clears cache if needed, and starts Expo.
  Usage:
    .\start.ps1            # Normal start
    .\start.ps1 -Clean     # Clear cache + reinstall before starting
    .\start.ps1 -CheckOnly # Only verify versions, don't start
#>
param(
    [switch]$Clean,
    [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ── Colors ──────────────────────────────────────────────────────────
function Write-Ok   ($msg) { Write-Host "  ✅ $msg" -ForegroundColor Green  }
function Write-Warn ($msg) { Write-Host "  ⚠️  $msg" -ForegroundColor Yellow }
function Write-Fail ($msg) { Write-Host "  ❌ $msg" -ForegroundColor Red    }
function Write-Step ($msg) { Write-Host "`n── $msg ──" -ForegroundColor Cyan }

# ── Expected versions (update these when upgrading SDK) ─────────────
$Expected = @{
    "node"                          = @{ Min = "18.0.0" }
    "expo"                          = @{ Range = "~54.0"; Prefix = "54.0" }
    "react"                         = @{ Range = "19.1";  Prefix = "19.1" }
    "react-native"                  = @{ Range = "0.81";  Prefix = "0.81" }
    "expo-router"                   = @{ Range = "~6.0";  Prefix = "6.0"  }
    "expo-constants"                = @{ Range = "~18.0"; Prefix = "18.0" }
    "expo-linking"                  = @{ Range = "~8.0";  Prefix = "8.0"  }
    "expo-status-bar"               = @{ Range = "~3.0";  Prefix = "3.0"  }
    "react-native-safe-area-context" = @{ Range = "~5.6"; Prefix = "5.6"  }
    "react-native-screens"          = @{ Range = "~4.16"; Prefix = "4.16" }
    "typescript"                    = @{ Range = "~5.8";  Prefix = "5.8"  }
    # devDependencies — test toolchain
    "jest"                          = @{ Range = "^29.7"; Prefix = "29."  }
    "ts-jest"                       = @{ Range = "^29.4"; Prefix = "29."  }
    "@types/jest"                   = @{ Range = "^29.5"; Prefix = "29."  }
}

$failed = 0

# ── 1. Node.js ──────────────────────────────────────────────────────
Write-Step "Checking Node.js"

$nodeVer = (node -v 2>$null)
if (-not $nodeVer) {
    Write-Fail "Node.js is not installed or not in PATH"
    exit 1
}
$nodeVer = $nodeVer.TrimStart("v")
$nodeMajor = [int]($nodeVer.Split(".")[0])
if ($nodeMajor -ge 18) {
    Write-Ok "Node.js $nodeVer (>= 18 required)"
} else {
    Write-Fail "Node.js $nodeVer — need >= 18.0.0"
    $failed++
}

# ── 2. npm packages ────────────────────────────────────────────────
Write-Step "Checking npm packages"

if (-not (Test-Path "node_modules")) {
    Write-Warn "node_modules not found — running npm install..."
    npm install 2>&1 | Out-Null
}

function Get-PkgVersion ($name) {
    $pkgJson = "node_modules/$name/package.json"
    if (-not (Test-Path $pkgJson)) { return $null }
    $json = Get-Content $pkgJson -Raw | ConvertFrom-Json
    return $json.version
}

foreach ($pkg in ($Expected.Keys | Where-Object { $_ -ne "node" } | Sort-Object)) {
    $spec = $Expected[$pkg]
    $ver  = Get-PkgVersion $pkg

    if (-not $ver) {
        Write-Fail "$pkg — NOT INSTALLED"
        $failed++
        continue
    }

    if ($ver.StartsWith($spec.Prefix)) {
        Write-Ok "$pkg@$ver  ($($spec.Range))"
    } else {
        Write-Fail "$pkg@$ver — expected $($spec.Range)"
        $failed++
    }
}

# ── 3. Version summary ─────────────────────────────────────────────
Write-Step "Result"

if ($failed -gt 0) {
    Write-Fail "$failed version mismatch(es) found."
    Write-Host "  Run: " -NoNewline
    Write-Host "npx expo install --fix" -ForegroundColor White
    Write-Host "  or:  " -NoNewline
    Write-Host ".\start.ps1 -Clean" -ForegroundColor White
    if (-not $Clean) { exit 1 }
}
else {
    Write-Ok "All versions match — ready to launch."
}

if ($CheckOnly) {
    Write-Host ""
    exit 0
}

# ── 4. Clean (optional) ────────────────────────────────────────────
if ($Clean) {
    Write-Step "Cleaning"
    if (Test-Path "node_modules") {
        Write-Host "  Removing node_modules..."
        Remove-Item -Recurse -Force "node_modules"
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
    }
    Write-Host "  Running npm install..."
    npm install 2>&1 | ForEach-Object { Write-Host "    $_" }
    Write-Host "  Clearing Expo cache..."
    npx expo start --clear --no-dev 2>&1 | Out-Null
    # Kill the --no-dev process if it's still alive
    Stop-Process -Name "node" -ErrorAction SilentlyContinue 2>$null
}

# ── 5. Kill stale Expo on port 8081 ────────────────────────────────
Write-Step "Checking port 8081"

$portCheck = netstat -ano 2>$null | Select-String ":8081\s"
if ($portCheck) {
    $pids = $portCheck | ForEach-Object {
        ($_ -replace '^\s+','') -split '\s+' | Select-Object -Last 1
    } | Sort-Object -Unique
    foreach ($pid in $pids) {
        if ($pid -and $pid -ne "0") {
            Write-Warn "Killing stale process on :8081 (PID $pid)"
            Stop-Process -Id ([int]$pid) -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
} else {
    Write-Ok "Port 8081 is free"
}

# ── 6. Launch Expo ──────────────────────────────────────────────────
Write-Step "Starting Expo dev server"
Write-Host "  Scan the QR code below with Expo Go on your phone." -ForegroundColor White
Write-Host "  Press 'a' for Android emulator, 'q' to quit.`n" -ForegroundColor DarkGray

npx expo start
