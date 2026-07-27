import { Router } from 'express';
import db from '../db.js';
const router = Router();
export const STAGES=['Wishlist','Applied','Screening','Interview_R1','Interview_R2','Offer','Rejected'];
const TERMINAL=['Offer','Rejected'];
router.get('/',(req,res)=>res.json(db.prepare('SELECT * FROM applications ORDER BY updated_at DESC').all()));
router.get('/:id',(req,res)=>{
 const app=db.prepare('SELECT * FROM applications WHERE id=?').get(req.params.id);
 if(!app) return res.status(404).json({error:'Not found'});
 const history=db.prepare('SELECT * FROM stage_history WHERE application_id=? ORDER BY changed_at DESC').all(req.params.id);
 const reminders=db.prepare('SELECT * FROM reminders WHERE application_id=? ORDER BY due_at').all(req.params.id);
 const interviews=db.prepare('SELECT * FROM interviews WHERE application_id=? ORDER BY scheduled_at DESC').all(req.params.id).map(i=>({...i,questions:db.prepare('SELECT * FROM interview_questions WHERE interview_id=?').all(i.id)}));
 const analyses=db.prepare('SELECT * FROM ai_analyses WHERE application_id=? ORDER BY created_at DESC').all(req.params.id).map(a=>({...a,result:JSON.parse(a.result_json)}));
 res.json({...app,history,reminders,interviews,analyses});
});
router.post('/',(req,res)=>{
 const b=req.body; if(!b.company||!b.role)return res.status(400).json({error:'company and role are required'});
 const r=db.prepare(`INSERT INTO applications(company,role,jd_link,jd_text,location,job_type,work_mode,source,salary,notes,current_stage,applied_at,deadline)
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(b.company,b.role,b.jd_link||null,b.jd_text||null,b.location||null,b.job_type||null,b.work_mode||null,b.source||null,b.salary||null,b.notes||null,b.current_stage||'Wishlist',b.applied_at||null,b.deadline||null);
 db.prepare('INSERT INTO stage_history(application_id,from_stage,to_stage,note) VALUES(?,NULL,?,?)').run(r.lastInsertRowid,b.current_stage||'Wishlist','Application created');
 res.status(201).json(db.prepare('SELECT * FROM applications WHERE id=?').get(r.lastInsertRowid));
});
router.patch('/:id/stage',(req,res)=>{
 const {to_stage,note}=req.body; if(!STAGES.includes(to_stage))return res.status(400).json({error:'Invalid stage'});
 const app=db.prepare('SELECT * FROM applications WHERE id=?').get(req.params.id); if(!app)return res.status(404).json({error:'Not found'});
 if(app.current_stage===to_stage)return res.json(app);
 if(TERMINAL.includes(app.current_stage))return res.status(400).json({error:`Cannot move out of terminal stage ${app.current_stage}`});
 db.prepare("UPDATE applications SET current_stage=?,updated_at=datetime('now'),applied_at=CASE WHEN ?='Applied' AND applied_at IS NULL THEN datetime('now') ELSE applied_at END WHERE id=?").run(to_stage,to_stage,req.params.id);
 db.prepare('INSERT INTO stage_history(application_id,from_stage,to_stage,note) VALUES(?,?,?,?)').run(req.params.id,app.current_stage,to_stage,note||null);
 res.json(db.prepare('SELECT * FROM applications WHERE id=?').get(req.params.id));
});
router.patch('/:id',(req,res)=>{
 const app=db.prepare('SELECT * FROM applications WHERE id=?').get(req.params.id); if(!app)return res.status(404).json({error:'Not found'});
 const fields=['company','role','jd_link','jd_text','location','job_type','work_mode','source','salary','notes','applied_at','deadline'];
 const vals=fields.map(k=>req.body[k]??app[k]);
 db.prepare(`UPDATE applications SET company=?,role=?,jd_link=?,jd_text=?,location=?,job_type=?,work_mode=?,source=?,salary=?,notes=?,applied_at=?,deadline=?,updated_at=datetime('now') WHERE id=?`).run(...vals,req.params.id);
 res.json(db.prepare('SELECT * FROM applications WHERE id=?').get(req.params.id));
});
router.delete('/:id',(req,res)=>{const r=db.prepare('DELETE FROM applications WHERE id=?').run(req.params.id);if(!r.changes)return res.status(404).json({error:'Not found'});res.status(204).send();});
export default router;
