Add-Type -AssemblyName System.Drawing

# Generate 192x192 icon
$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g192.Clear([System.Drawing.Color]::FromArgb(16, 185, 129))

# Draw white circle
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g192.FillEllipse($brush, 48, 48, 96, 96)

# Draw clock hands
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 6)
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g192.DrawLine($pen, 96, 96, 96, 60)
$g192.DrawLine($pen, 96, 96, 132, 96)

$bmp192.Save('public\icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp192.Dispose()
$g192.Dispose()

# Generate 512x512 icon
$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g512.Clear([System.Drawing.Color]::FromArgb(16, 185, 129))

# Draw white circle
$brush512 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g512.FillEllipse($brush512, 128, 128, 256, 256)

# Draw clock hands
$pen512 = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 16)
$pen512.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g512.DrawLine($pen512, 256, 256, 256, 160)
$g512.DrawLine($pen512, 256, 256, 352, 256)

$bmp512.Save('public\icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Dispose()
$g512.Dispose()

Write-Host "Icons generated successfully!"

