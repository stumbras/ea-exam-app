# Copies the sources into pwa/src and writes pwa/HISTORY.md, so every shipped version carries
# everything needed to rebuild and continue. Called by tmp/ship.sh "Version N" "message".
import os,shutil,glob,subprocess,sys,datetime
A='/home/claude/ea-app';D=A+'/pwa/src'
shutil.rmtree(D,ignore_errors=True);os.makedirs(D+'/tmp');os.makedirs(D+'/tools')
for f in glob.glob(A+'/*.js')+glob.glob(A+'/*.py')+[A+'/app.html',A+'/todo.json',A+'/HISTORY.md']:
    if os.path.exists(f):shutil.copy2(f,D)
if os.path.isdir(A+'/ex'):shutil.copytree(A+'/ex',D+'/ex')
for f in glob.glob(A+'/tmp/t*.js')+glob.glob(A+'/tmp/*.sh')+[A+'/tmp/sync_src.py']:shutil.copy2(f,D+'/tmp')
for f in glob.glob('/home/claude/tts_*.py'):shutil.copy2(f,D+'/tools')
log=subprocess.run(['git','-C','/home/claude/ea-exam-app','log','--format=%ad %s','--date=short'],capture_output=True,text=True).stdout.strip().split('\n')
if len(sys.argv)>2:log.insert(0,datetime.date.today().isoformat()+' '+sys.argv[1]+': '+sys.argv[2])
h=open(A+'/HISTORY.md').read().rstrip()+'\n\n'+'\n'.join('- '+l for l in log if l.strip())+'\n'
open(A+'/pwa/HISTORY.md','w').write(h)
n=sum(len(fs) for _,_,fs in os.walk(D));print('src files',n,'history lines',len(log))
