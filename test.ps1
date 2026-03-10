<#
  Mafia AI Arena — Test Runner Script
  Runs Jest tests with formatting, optional filtering, and TypeScript check.
  Usage:
    .\test.ps1                    # Run all tests
    .\test.ps1 -Suite state       # Run only tests matching "state"
    .\test.ps1 -Coverage          # Run with coverage report
    .\test.ps1 -Watch             # Run in watch mode
    .\test.ps1 -TypeCheck         # Run tsc --noEmit before tests
    .\test.ps1 -Suite hooks -Watch # Combine flags
#>
param(
    [string]$Suite,
    [switch]$Coverage,
    [switch]$Watch,
    [switch]$TypeCheck
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ── Colors ──────────────────────────────────────────────────────────
function Write-Ok   ($msg) { Write-Host "  ✅ $msg" -ForegroundColor Green  }
function Write-Warn ($msg) { Write-Host "  ⚠️  $msg" -ForegroundColor Yellow }
function Write-Fail ($msg) { Write-Host "  ❌ $msg" -ForegroundColor Red    }
function Write-Step ($msg) { Write-Host "`n── $msg ──" -ForegroundColor Cyan }

# ── 1. Verify node_modules ─────────────────────────────────────────
if (-not (Test-Path "node_modules")) {
    Write-Warn "node_modules not found — running npm install..."
    npm install 2>&1 | Out-Null
    Write-Ok "Dependencies installed"
}

# ── 2. TypeScript check (optional) ─────────────────────────────────
if ($TypeCheck) {
    Write-Step "TypeScript check"
    $tscOutput = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Ok "tsc --noEmit passed (no type errors)"
    } else {
        Write-Fail "TypeScript errors found:"
        $tscOutput | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
        exit 1
    }
}

# ── 3. Build Jest arguments ─────────────────────────────────────────
Write-Step "Running tests"

$jestArgs = @("jest", "--verbose")

if ($Suite) {
    $jestArgs += "--testPathPattern"
    $jestArgs += $Suite
    Write-Host "  Filter: $Suite" -ForegroundColor DarkGray
}

if ($Coverage) {
    $jestArgs += "--coverage"
    Write-Host "  Coverage: enabled" -ForegroundColor DarkGray
}

if ($Watch) {
    $jestArgs += "--watch"
    Write-Host "  Watch: enabled" -ForegroundColor DarkGray
}

Write-Host ""

# ── 4. Run Jest ─────────────────────────────────────────────────────
npx @jestArgs
$exitCode = $LASTEXITCODE

# ── 5. Summary ──────────────────────────────────────────────────────
Write-Host ""
if ($exitCode -eq 0) {
    Write-Ok "All tests passed."
} else {
    Write-Fail "Some tests failed (exit code $exitCode)."
}

exit $exitCode
