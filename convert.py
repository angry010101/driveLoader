import imghdr
from PIL import Image

from PIL import Image
import glob
image_list = []
for filename in glob.glob('*.jpeg'): #assuming gif
    im=Image.open(filename)
    image_list.append(im)

ind=0
for i in image_list:
    #im = Image.open(i).convert("RGB")
    im = i.convert("RGB")
    im.save(str(ind) + ".jpg","jpeg")
    ind+=1
