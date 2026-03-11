const lightBox = document.getElementById('lightbox');
const lightBoxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close-btn');

// 1. Find all the images in the screenshot section
document.querySelectorAll('.screenshots img').forEach(img => {
    img.onclick =  () =>{
        lightBox.style.display = 'flex';
        lightBoxImg.src = img.src;
    }
});

// 2. Hide the container when the x is clicked
closeBtn.onclick = () =>{
    lightBox.style.display = 'none';
};
// 3. Also hide the container if the black background is clicked
lightBox.onclick = (e) =>{
    if(e.target !== lightBoxImg){
        lightBox.style.display = 'none';
    }
}

z``