
const data=window.REVISION_DATA;
const topic=document.getElementById('topic-choice'),help=document.getElementById('topic-help');
const subjectsCard=document.getElementById('subjects-card'),orientation=document.getElementById('orientation-card');
const quizCard=document.getElementById('quiz-card'),resultCard=document.getElementById('result-card');
let current=null;

data.cases.forEach((c,i)=>{const o=document.createElement('option');o.value=c.id;o.textContent=`${i+1}. ${c.title} — ${c.level}`;topic.appendChild(o)});
function updateHelp(){const c=data.cases.find(x=>x.id===topic.value);help.innerHTML=`<b>Orientation :</b> ${c.orientation}`;}
topic.onchange=updateHelp;updateHelp();

document.getElementById('begin-btn').onclick=()=>start(topic.value);
function start(id){
 current=data.cases.find(x=>x.id===id);
 orientation.classList.add('hidden');subjectsCard.classList.add('hidden');resultCard.classList.add('hidden');quizCard.classList.remove('hidden');
 document.getElementById('quiz-title').textContent=current.title;
 document.getElementById('quiz-level').textContent=`Niveau : ${current.level}`;
 document.getElementById('case-text').innerHTML=`<b>Situation :</b> ${current.situation}`;
 const holder=document.getElementById('questions');holder.innerHTML='';
 current.questions.forEach((q,i)=>{
   const d=document.createElement('div');d.className='question';
   let html=`<h3>Question ${i+1} <span class="qtype">${q.type}</span><br>${q.question}</h3>`;
   const inputType=q.type==='QCM'?'checkbox':'radio';
   q.choices.forEach((ch,j)=>{html+=`<label class="choice"><input type="${inputType}" name="q${i}" value="${j}"> ${String.fromCharCode(65+j)}. ${ch}</label>`});
   d.innerHTML=html;holder.appendChild(d);
 });
 window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('submit-btn').onclick=()=>finish();

function finish(){
 let correct=0,wrong=0,blank=0,html='';
 current.questions.forEach((q,i)=>{
   const selected=[...document.querySelectorAll(`input[name="q${i}"]:checked`)].map(x=>Number(x.value)).sort((a,b)=>a-b);
   let status='blank',userText='Aucune réponse';
   if(!selected.length){blank++}
   else{
     userText=selected.map(v=>`${String.fromCharCode(65+v)}. ${q.choices[v]}`).join(' ; ');
     const expected=q.answerIndexes;
     if(selected.length===expected.length && selected.every((v,k)=>v===expected[k])){correct++;status='good'}else{wrong++;status='bad'}
   }
   const expectedText=q.answerIndexes.map(v=>`${String.fromCharCode(65+v)}. ${q.choices[v]}`).join(' ; ');
   html+=`<div class="review-item ${status}"><b>Question ${i+1} — ${status==='good'?'Bonne réponse':status==='bad'?'Réponse fausse':'Sans réponse'}</b>
   <p>${q.question}</p><p><b>Ta réponse :</b> ${userText}</p>
   <p><b>Réponse attendue :</b> ${expectedText}</p>
   <div class="explain"><b>Explication :</b> ${q.explanation}<br><b>Source :</b> ${q.source}</div></div>`;
 });
 const score=correct-wrong;
 quizCard.classList.add('hidden');resultCard.classList.remove('hidden');
 document.getElementById('score').textContent=`${score} points`;
 document.getElementById('score-message').textContent=`Bonnes réponses : ${correct} · Mauvaises réponses : ${wrong} · Sans réponse : ${blank} · Barème : +1 / −1 / 0`;
 document.getElementById('review').innerHTML=html;window.scrollTo({top:0,behavior:'smooth'});
}
document.getElementById('retry-btn').onclick=()=>start(current.id);
document.getElementById('subjects-btn').onclick=()=>{resultCard.classList.add('hidden');orientation.classList.remove('hidden');subjectsCard.classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})};
