# Create directories if they don't exist
$directories = @(
    "src/assets/img/products",
    "src/assets/img/features",
    "src/assets/img/banner",
    "src/assets/img/blog",
    "src/assets/img/about",
    "src/assets/img/pay",
    "src/assets/img/people"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Base URL for the images
$baseUrl = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img"

# Product images
$productImages = @("f1.jpg", "f2.jpg", "f3.jpg", "f4.jpg", "f5.jpg", "f6.jpg", "f7.jpg", "f8.jpg",
                  "n1.jpg", "n2.jpg", "n3.jpg", "n4.jpg", "n5.jpg", "n6.jpg", "n7.jpg", "n8.jpg")

foreach ($image in $productImages) {
    $url = "$baseUrl/products/$image"
    $outputPath = "src/assets/img/products/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Feature images
$featureImages = @("f1.png", "f2.png", "f3.png", "f4.png", "f5.png", "f6.png")

foreach ($image in $featureImages) {
    $url = "$baseUrl/features/$image"
    $outputPath = "src/assets/img/features/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Banner images
$bannerImages = @("b1.jpg", "b2.jpg", "b4.jpg", "b7.jpg", "b10.jpg", "b14.png", "b16.jpg", "b17.jpg", "b18.jpg", "b19.jpg", "b20.jpg")

foreach ($image in $bannerImages) {
    $url = "$baseUrl/banner/$image"
    $outputPath = "src/assets/img/banner/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Blog images
$blogImages = @("b1.jpg", "b2.jpg", "b3.jpg", "b4.jpg", "b5.jpg", "b6.jpg", "b7.jpg")

foreach ($image in $blogImages) {
    $url = "$baseUrl/blog/$image"
    $outputPath = "src/assets/img/blog/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# About page image
$aboutImage = "a6.jpg"
$url = "$baseUrl/about/$aboutImage"
$outputPath = "src/assets/img/about/$aboutImage"
Write-Host "Downloading $url to $outputPath"
Invoke-WebRequest -Uri $url -OutFile $outputPath

# People images
$peopleImages = @("1.png", "2.png", "3.png")

foreach ($image in $peopleImages) {
    $url = "$baseUrl/people/$image"
    $outputPath = "src/assets/img/people/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Payment images
$payImages = @("app.jpg", "play.jpg", "pay.png")

foreach ($image in $payImages) {
    $url = "$baseUrl/pay/$image"
    $outputPath = "src/assets/img/pay/$image"
    Write-Host "Downloading $url to $outputPath"
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

Write-Host "All images have been downloaded!"
