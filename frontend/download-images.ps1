# Create products directory if it doesn't exist
$productsDir = "src/assets/img/products"
if (-not (Test-Path $productsDir)) {
    New-Item -ItemType Directory -Path $productsDir -Force
}

# Array of image URLs and their corresponding filenames
$images = @(
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f1.jpg"
        filename = "f1.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f2.jpg"
        filename = "f2.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f3.jpg"
        filename = "f3.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f4.jpg"
        filename = "f4.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f5.jpg"
        filename = "f5.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f6.jpg"
        filename = "f6.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f7.jpg"
        filename = "f7.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/f8.jpg"
        filename = "f8.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n1.jpg"
        filename = "n1.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n2.jpg"
        filename = "n2.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n3.jpg"
        filename = "n3.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n4.jpg"
        filename = "n4.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n5.jpg"
        filename = "n5.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n6.jpg"
        filename = "n6.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n7.jpg"
        filename = "n7.jpg"
    },
    @{
        url = "https://raw.githubusercontent.com/tech2etc/Build-and-Deploy-Ecommerce-Website/main/img/products/n8.jpg"
        filename = "n8.jpg"
    }
)

# Download each image
foreach ($image in $images) {
    $outputPath = Join-Path $productsDir $image.filename
    Write-Host "Downloading $($image.url) to $outputPath"
    Invoke-WebRequest -Uri $image.url -OutFile $outputPath
}
