import {supabase} from '@/integrations/supabase/client';
import {jsPDF} from 'jspdf';
export function validateFile(file:File, video=false) {
 const allowed=video?['image/jpeg','image/png','image/webp','video/mp4','video/webm']:['image/jpeg','image/png','image/webp','application/pdf'];
 if(!allowed.includes(file.type)) throw new Error('Tipo de archivo no permitido');
 if(file.size>(file.type.startsWith('video')?20:10)*1024*1024) throw new Error('El archivo supera el límite de tamaño');
}
export async function uploadContractFile(contract:string,user:string,file:File,video=false) {
 validateFile(file,video);
 const extension=file.type==='application/pdf'?'pdf':file.type.split('/')[1]==='jpeg'?'jpg':file.type.split('/')[1];
 const path=`${contract}/${user}/${crypto.randomUUID()}.${extension}`;
 const {error}=await supabase.storage.from('contract-files').upload(path,file); if(error) throw error; return path;
}
export async function openContractFile(path:string) {
 const {data,error}=await supabase.storage.from('contract-files').createSignedUrl(path,120); if(error) throw error;
 window.open(data.signedUrl,'_blank','noopener,noreferrer');
}
export function downloadCsv(name:string,rows:unknown[][]) {
 const content='\ufeff'+rows.map(r=>r.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'})); const a=document.createElement('a');a.href=url;a.download=name+'.csv';a.click();URL.revokeObjectURL(url);
}
export function downloadPdf(name:string,lines:string[]) {
 const doc=new jsPDF(); let y=20; doc.setFontSize(11);
 for(const line of lines) for(const text of doc.splitTextToSize(line,175)){if(y>275){doc.addPage();y=20;}doc.text(text,18,y);y+=7;}
 doc.save(name+'.pdf');
}
