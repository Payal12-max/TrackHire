import {Router} from 'express';import db from '../db.js';const r=Router();
r.get('/',(q,s)=>{
 const apps=db.prepare('SELECT * FROM applications').all(); const total=apps.length; const applied=apps.filter(a=>a.current_stage!=='Wishlist').length;
 const byStage=Object.fromEntries(['Wishlist','Applied','Screening','Interview_R1','Interview_R2','Offer','Rejected'].map(st=>[st,apps.filter(a=>a.current_stage===st).length]));
 const history=db.prepare('SELECT * FROM stage_history').all(); const reached={}; for(const st of Object.keys(byStage)) reached[st]=new Set(history.filter(h=>h.to_stage===st).map(h=>h.application_id)).size;
 const bySource=db.prepare("SELECT COALESCE(source,'Unknown') name,COUNT(*) value FROM applications GROUP BY COALESCE(source,'Unknown') ORDER BY value DESC").all();
 const monthly=db.prepare("SELECT substr(COALESCE(applied_at,created_at),1,7) month,COUNT(*) count FROM applications GROUP BY month ORDER BY month").all();
 const reminders=db.prepare('SELECT COUNT(*) count FROM reminders WHERE completed=0').get().count;
 const overdue=db.prepare("SELECT COUNT(*) count FROM reminders WHERE completed=0 AND due_at<datetime('now')").get().count;
 s.json({total,applied,offers:byStage.Offer,rejections:byStage.Rejected,offerRate:applied?Math.round(byStage.Offer/applied*100):0,byStage,reached,bySource,monthly,openReminders:reminders,overdue});
});export default r;
