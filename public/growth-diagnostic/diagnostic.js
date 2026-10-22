    const form = document.getElementById('assessment');
    const progress = document.getElementById('progress');
    const progressCopy = document.getElementById('progress-copy');
    const error = document.getElementById('error');
    const result = document.getElementById('result');
    const categories = [
      {key:'positioning',label:'Positioning',questions:['positioning_audience','positioning_value'],advice:'Sharpen the audience, the problem you solve, and the reason a buyer should choose you. Validate the language in real customer conversations.'},
      {key:'discovery',label:'Discovery',questions:['discovery_reach','discovery_content'],advice:'Choose the discovery channels that match buyer intent. Build useful answers to high-value questions and review whether the right audience can find them.'},
      {key:'conversion',label:'Conversion',questions:['conversion_path','conversion_trust'],advice:'Remove friction from the main next step. Make the offer, process, relevant proof, and follow-up expectations easy to understand.'},
      {key:'measurement',label:'Measurement',questions:['measurement_tracking','measurement_learning'],advice:'Define a small set of outcome measures, establish a baseline, and schedule reviews that lead to explicit decisions.'},
      {key:'alignment',label:'Alignment',questions:['alignment_channels','alignment_feedback'],advice:'Map the handoffs between channels and customer-facing teams. Create a repeatable loop for sharing buyer feedback and improving the journey.'}
    ];
    const allNames = categories.flatMap(c => c.questions);
    function currentAnswers(){const out={};for(const name of allNames){const chosen=form.querySelector('input[name="'+name+'"]:checked');if(chosen)out[name]=Number(chosen.value)}return out}
    function updateProgress(){const answers=currentAnswers();const count=Object.keys(answers).length;progress.style.width=(count/allNames.length*100)+'%';progressCopy.textContent=count+' of '+allNames.length+' answered';if(count===allNames.length)error.classList.remove('visible')}
    form.addEventListener('change',updateProgress);
    function recommendationFor(category,score){if(score>=5)return 'Maintain this strength and test how it can reinforce the weaker parts of the system.';return category.advice}
    function buildResult(answers){
      const scores=categories.map(c=>({...c,score:c.questions.reduce((sum,q)=>sum+answers[q],0)}));
      const total=scores.reduce((sum,c)=>sum+c.score,0);const pct=Math.round(total/30*100);
      let title,summary;
      if(pct<40){title='Strengthen the foundations';summary='Your answers suggest that several parts of the growth system need clearer foundations. Start with the constraint most likely to block the next customer action, rather than adding more activity.'}
      else if(pct<70){title='Connect the moving parts';summary='Some foundations are in place, but your answers suggest there may be gaps between discovery, conversion, measurement, and team learning. Prioritise the handoffs that lose the most momentum.'}
      else{title='Improve the feedback loop';summary='Your answers suggest a relatively connected system. The next opportunity is to validate assumptions with evidence, remove remaining friction, and invest in the improvements with the clearest business impact.'}
      document.getElementById('score').innerHTML=pct+'<span>/100</span>';
      document.getElementById('result-title').textContent=title;
      document.getElementById('result-summary').textContent=summary;
      document.getElementById('category-list').innerHTML=scores.map(c=>'<div><div class="category-top"><span>'+c.label+'</span><span>'+c.score+'/6</span></div><div class="bar" role="img" aria-label="'+c.label+': '+c.score+' out of 6"><span style="width:'+(c.score/6*100)+'%"></span></div></div>').join('');
      const ranked=[...scores].sort((a,b)=>a.score-b.score);
      document.getElementById('next-list').innerHTML=ranked.slice(0,3).map(c=>'<li><strong>'+c.label+':</strong> '+recommendationFor(c,c.score)+'</li>').join('');
      result.classList.add('visible');result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
      const report='River Ways Growth Diagnostic\nOverall self-assessment: '+pct+'/100\n'+title+'\n\n'+scores.map(c=>c.label+': '+c.score+'/6').join('\n')+'\n\nRecommended next moves:\n'+ranked.slice(0,3).map(c=>'- '+c.label+': '+c.advice).join('\n')+'\n\nThis is a directional self-assessment based on my answers, not an automated audit.';
      document.getElementById('copy-result').onclick=async()=>{const button=document.getElementById('copy-result');try{await navigator.clipboard.writeText(report);button.textContent='Copied';}catch{const area=document.createElement('textarea');area.value=report;area.setAttribute('readonly','');area.style.position='absolute';area.style.left='-9999px';document.body.appendChild(area);area.select();const copied=document.execCommand('copy');area.remove();button.textContent=copied?'Copied':'Select and copy manually';}setTimeout(()=>button.textContent='Copy summary',2200)};
      const link=document.getElementById('brief-link');
      const incoming = new URLSearchParams(window.location.search);
      const attribution = new URLSearchParams();
      for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
        const value = incoming.get(key);
        if (value) attribution.set(key, value.slice(0, 160));
      }
      attribution.set('rw_landing_page', window.location.pathname || '/growth-diagnostic/');
      const queryString = attribution.toString();
      link.href = '/' + (queryString ? '?' + queryString : '') + '#contact';
      link.setAttribute('aria-label','Discuss my growth diagnostic with River Ways');
    }
    form.addEventListener('submit',event=>{event.preventDefault();const answers=currentAnswers();if(Object.keys(answers).length!==allNames.length){error.classList.add('visible');const firstMissing=allNames.find(n=>!answers[n]);form.querySelector('input[name="'+firstMissing+'"]')?.focus();return}error.classList.remove('visible');buildResult(answers)});
    updateProgress();
