let dom = $(document);

function beginMovement(){
    const element = document.getElementById("lane1");

    let width = 0;

    $(element).css({"background-color": "blue"})

    setInterval(movement, 500);

    function movement(){
        const unit = 1;
    
        width += unit;
    
        element.style.marginLeft = width + '%';
    }
}