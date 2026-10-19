# Rebuilds and restarts the production server cleanly.
#
# Next writes new content-hashed chunks on every build. If a `next start`
# process is still holding the old .next while a build replaces it, that
# server keeps serving stale chunk names and returns 500s for them — which
# looks like an application bug but is only a stale process. Always stop the
# server before building.

param([switch]$SkipBuild)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..

function Stop-OnPort($port) {
  $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
  foreach ($c in $conns) {
    Write-Host "stopping PID $($c.OwningProcess) on port $port"
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}

Stop-OnPort 3000
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -like '*silver-one*next*' } |
  ForEach-Object {
    Write-Host "stopping next PID $($_.ProcessId)"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
Start-Sleep -Seconds 2

if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
  throw 'port 3000 is still in use'
}

if (-not $SkipBuild) {
  Write-Host '--- building ---'
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'build failed' }
}

Write-Host '--- starting ---'
$log = Join-Path $PWD '.qa\prod.log'
New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npm run start' -NoNewWindow -RedirectStandardOutput $log -RedirectStandardError "$log.err"

for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing -TimeoutSec 5
    if ($r.StatusCode -eq 200) { Write-Host "ready after $([math]::Round($i*0.5,1))s"; exit 0 }
  } catch { }
}
throw 'server did not become ready'
