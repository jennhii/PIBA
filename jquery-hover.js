$('.grd_box').each(function(i) {//so you can have a few on a page
    //set vars
    var dur = 350,//duration
        box = $(this).children('.box'),//elements
        bl = box.length;//no of elements
    
    if (bl>1) {
        //set more vars
        var bi = 100/bl,//initial size
            bm = bl/1.5;//size multiplier :: you can use numbers too, should be > 1 and < bl
        
        //for safety
        if (bm>=bl) { bm = bl-1; }//multiplier should be less than length
        if (bm<2) {bm = 2; }//multiplier should be at least 2
        if (bl==2) { bm=1.5; }//unless you only have 2, then it shoud be 1.5
        
        //set even more vars
        var bo = bi*bm,//large size
            bs = (100-bo)/(bl-1);//small size
        
        //do things
        box.css({width: bi+'%'})//set width
        .hover(function(){//on in
            $(this).stop().animate({ width: bo+'%' },dur)//animate
            .siblings().stop().animate({ width: bs+'%' },dur);//animate sibs
        }, function(){//on out
            box.stop().animate({ width: bi+'%' },dur);//animate all          
        });
    } else {
    }
});