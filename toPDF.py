from fpdf import FPDF
pdf = FPDF()
# imagelist is the list with all image filenames

from PIL import Image
import glob
image_list = []
for filename in glob.glob('*.jpg'): #assuming gif
    image_list.append(filename)


for image in image_list:
    pdf.add_page()
    im=Image.open(image)
    width, height = im.size
    pdf.image(image,0,0)
    
fname = input("ENTER FILE NAME: ")
pdf.output(fname + ".pdf", "F")
