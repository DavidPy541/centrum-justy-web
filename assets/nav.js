(function(){
  var header=document.querySelector('header');
  var toggle=document.querySelector('.nav-toggle');
  if(!header||!toggle)return;
  var mq=window.matchMedia('(max-width:900px)');
  function setOpen(o){header.classList.toggle('nav-open',o);toggle.setAttribute('aria-expanded',o?'true':'false');}
  toggle.addEventListener('click',function(){setOpen(!header.classList.contains('nav-open'));});
  document.querySelectorAll('.has-dropdown > .drop-trigger').forEach(function(t){
    t.addEventListener('click',function(e){
      if(!mq.matches)return;
      e.preventDefault();
      var g=t.parentNode,was=g.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(function(x){x.classList.remove('open');});
      if(!was)g.classList.add('open');
    });
  });
  document.querySelectorAll('.dropdown a').forEach(function(l){l.addEventListener('click',function(){setOpen(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  mq.addEventListener&&mq.addEventListener('change',function(){setOpen(false);document.querySelectorAll('.has-dropdown.open').forEach(function(x){x.classList.remove('open');});});
})();
