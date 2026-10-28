param([int]$Time, [string]$Out)

$p = Start-Process -FilePath python -ArgumentList @("_shot.py", "$Time") -PassThru
Start-Sleep -Milliseconds 2200

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

$w = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$h = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height
$bmp = New-Object System.Drawing.Bitmap $w, $h
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen(0, 0, 0, 0, $bmp.Size)
$bmp.Save($Out)
$g.Dispose()
$bmp.Dispose()

Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
Write-Output "saved $Out ($w x $h)"
