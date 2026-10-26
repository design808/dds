/* Presentation-only question outline. The existing question runtime owns all
   values, ordering and saving. This observes its rendered forms without
   altering their structure or creating a second source of data. */
const questions=document.querySelector('#questions');
const outline=document.querySelector('#question-outline-links');
if(questions&&outline){
 let frame=0;
 const sync=()=>{
  const forms=[...questions.querySelectorAll('.question-form')];
  const focused=document.activeElement?.closest('.question-form')?.id;
  const previous=outline.querySelector('[aria-current=true]')?.getAttribute('href');
  const selected=focused&&forms.some(form=>form.id===focused)?'#'+focused:forms.some(form=>'#'+form.id===previous)?previous:'#'+forms[0]?.id;
  outline.replaceChildren(...forms.map((form,index)=>{
   const link=document.createElement('a');
   link.href='#'+form.id;
   const number=document.createElement('span');number.className='outline-number';number.textContent=String(index+1).padStart(2,'0');
   const text=document.createElement('span');text.className='outline-label';
   const title=document.createElement('strong');title.textContent='문항 '+(index+1);
   const category=document.createElement('span');category.textContent=form.querySelector('[data-q-field=type]')?.value||'질문 카테고리';
   text.append(title,category);link.append(number,text);
   if(selected===link.getAttribute('href'))link.setAttribute('aria-current','true');
   return link;
  }));
  document.querySelector('#outline-count').textContent=String(forms.length);
 };
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync);};
 new MutationObserver(schedule).observe(questions,{childList:true});
 questions.addEventListener('change',schedule);
 questions.addEventListener('focusin',event=>{
  const form=event.target.closest('.question-form');if(!form)return;
  outline.querySelectorAll('a').forEach(link=>{if(link.hash==='#'+form.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
 });
 outline.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link)return;
  outline.querySelectorAll('a').forEach(other=>other.removeAttribute('aria-current'));
  link.setAttribute('aria-current','true');
 });
 sync();
}
