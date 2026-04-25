import os
import glob
from PIL import Image

def process_images(directory, max_dimension=2000, quality=80):
    files = glob.glob(os.path.join(directory, '*.jpg')) + glob.glob(os.path.join(directory, '*.jpeg')) + glob.glob(os.path.join(directory, '*.png'))
    count = 0
    
    for file_path in files:
        try:
            with Image.open(file_path) as img:
                # Calculate new size maintaining aspect ratio
                width, height = img.size
                if width > max_dimension or height > max_dimension:
                    if width > height:
                        new_width = max_dimension
                        new_height = int(height * (max_dimension / width))
                    else:
                        new_height = max_dimension
                        new_width = int(width * (max_dimension / height))
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Create new filename
                base_name = os.path.splitext(file_path)[0]
                new_file_path = base_name + '.webp'
                
                # Save as webp
                img.save(new_file_path, 'WEBP', quality=quality)
                print(f"Converted {file_path} to {new_file_path}")
            
            # Remove original file
            os.remove(file_path)
            count += 1
            
        except Exception as e:
            print(f"Failed to process {file_path}: {e}")
            
    print(f"Successfully processed {count} images in {directory}")

if __name__ == "__main__":
    process_images('img')
