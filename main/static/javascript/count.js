if(minutes == 0) {
    el.innerHTML = "countdown is over"
    document.myform.submit();
    clearInterval(interval);
    return;
}   else {
    minutes --;
    seconds = 60;
}