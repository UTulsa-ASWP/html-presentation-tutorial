'use strict';
const fs=require('fs');
const html=fs.readFileSync('/mnt/user-data/outputs/cycle/iteration-3/pathfinding-race.html','utf8');
let pass=0, fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL:',m);} };

console.log('STYLE: light theme tokens present, dark removed');
ok(/--bg:#f5f5f7/.test(html), 'page bg is Apple off-white #f5f5f7');
ok(/--card:#ffffff/.test(html), 'card surface white');
ok(/--accent:#0071e3/.test(html), 'Apple blue accent token');
ok(/--path:#ffd60a/.test(html), 'validated path color #ffd60a shipped');
ok(/--open:#5ac8fa/.test(html), 'open cyan shipped');
ok(/--closed:#dfe4ee/.test(html), 'closed gray shipped');
ok(!/0b0e13/.test(html) && !/#10151d/.test(html), 'old dark surface colors removed');
ok(!/repeating-linear-gradient/.test(html), 'graph-paper texture removed');
ok(!/-webkit-background-clip:text/.test(html), 'gradient-text heading removed');

console.log('STYLE: Apple-isms applied');
ok(/\.segmented\{/.test(html), 'segmented control styles present');
ok(/class="segmented"/.test(html), 'paint tools wrapped in segmented control');
ok(/border-radius:980px/.test(html), 'pill-radius buttons');
ok(/box-shadow:var\(--shadow\)/.test(html), 'soft diffuse card shadow used');
ok(/-apple-system/.test(html), 'system (SF) font stack');
ok(/\.pname::before/.test(html), 'algorithm identity dot via ::before');
ok(/\.cell\.path\{background:var\(--path\); box-shadow:inset 0 0 0 2px/.test(html), 'path has non-color inset ring cue');
ok(/font-size:40px/.test(html), 'large light heading');

console.log('STYLE: IDs preserved (tests depend on these)');
['tool-wall','tool-weight','tool-erase','play','step','reset','random','clear','speed','studytoggle','panels','study','hint']
  .forEach(id=>ok(new RegExp('id="'+id+'"').test(html), 'id "'+id+'" preserved'));

console.log('STYLE: no emoji in toggle label (clean text)');
ok(/>Study Mode</.test(html), 'study toggle uses clean text label');

console.log('\n'+(fail===0?'STYLE CHECKS: ALL PASS':'STYLE CHECKS: FAILURES')+'  pass='+pass+' fail='+fail);
process.exit(fail===0?0:1);
