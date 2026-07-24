Get-ChildItem "c:\Users\jawah\healthy-eye-clinic-user\src\components\*.jsx" | ForEach-Object {
  $c = Get-Content $_.FullName -Raw
  $c = $c -replace 'text-slate-300', 'text-white/80'
  $c = $c -replace 'text-slate-400', 'text-white/60'
  $c = $c -replace 'text-slate-500', 'text-white/50'
  $c = $c -replace 'text-slate-600', 'text-white/40'
  $c = $c -replace 'text-slate-700', 'text-white/70'
  Set-Content $_.FullName -Value $c -NoNewline
  Write-Host ("Fixed: " + $_.Name)
}
