# Builds the free-app banks for the study engine: part 11 citizenship, 12 driving, 13 motorcycle.
import json,re,os,importlib.util
J=lambda s:json.dumps(s,ensure_ascii=False)
src=open('site_civics.py').read()
NOW={int(n):nm for n,nm in re.findall(r'(\d+):\s*\(\["([^"]+)"',src)}
CHK=(re.search(r'CHECKED\s*=\s*"([^"]+)"',src) or [None,""])[1]
names=[NOW[k] for k in (38,39,30,57) if k in NOW]
W={1:(None,["Constitutional monarchy","Confederation of independent states","Parliamentary system with a prime minister"]),2:("The U.S. Constitution",["The Articles of Confederation","The Emancipation Proclamation","The Declaration of Independence"]),
3:(None,["Declares independence from Britain","Names each president","Sets the price of goods"]),4:(None,["Rule by one king","Government by the courts only","Power belongs to the states alone"]),
5:(None,["Presidential orders","Supreme Court votes","Agreement of the state governors"]),6:("The basic rights of Americans",["The powers of the president","The borders of the states","The government's right to tax"]),
7:(None,["Ten (10)","Twenty-one (21)","Fifty (50)"]),8:(None,["It created the three branches of government.","It ended the Civil War.","It gave women the right to vote."]),
9:(None,["U.S. Constitution","Bill of Rights","Federalist Papers"]),10:("Equality and liberty",["Monarchy and nobility","Taxation and tariffs","Slavery and segregation"]),
11:(None,["U.S. Constitution","Bill of Rights","Emancipation Proclamation"]),12:(None,["Communism","Socialism","Feudalism"]),13:(None,["The president makes all the laws.","Only citizens must follow the law.","Judges are above the law."]),
14:(None,["Emancipation Proclamation","Gettysburg Address","Treaty of Versailles"]),15:(None,["So each state gets its own branch","To make the government faster","So the president can control the courts"]),
16:(None,["Federal, state, and local","Senate, House, and Cabinet","Army, Navy, and Air Force"]),17:(None,["Legislative branch","Judicial branch","State branch"]),18:("The U.S. Congress",["The Supreme Court","The President","The Cabinet"]),
19:("Senate and House of Representatives",["Cabinet and Supreme Court","Democrats and Republicans","Governors and mayors"]),20:(None,["Vetoes bills","Appoints federal judges","Commands the military"]),
21:(None,["Fifty (50)","Four hundred thirty-five (435)","Two hundred (200)"]),22:(None,["Two (2) years","Four (4) years","For life"]),24:(None,["One hundred (100)","Two hundred seventy (270)","Five hundred thirty-eight (538)"]),
25:(None,["Four (4) years","Six (6) years","One (1) year"]),26:(None,["Because they are paid less","Because the Senate votes them out","Because the president sets their term"]),27:(None,["One (1)","Four (4)","It depends on the state's population"]),
28:("Equal representation for small states",["Because of the state's population","Because of the 22nd Amendment","So each party gets one"]),31:(None,["Citizens of the whole country","Only the people who voted for them","Citizens in one congressional district"]),
32:(None,["The Electoral College","The House of Representatives","The governor of the state"]),33:("Citizens in their congressional district",["All citizens of their state","The whole country","Their political party only"]),
34:("Citizens from their congressional district",["Citizens from their whole state","The state legislature","The Senate"]),35:("Because of the state's population",["Because the state has more land","Because the state joined the Union earlier","Because the state pays more taxes"]),
36:(None,["Two (2) years","Six (6) years","Eight (8) years"]),37:("Because of the 22nd Amendment",["Because of the 10th Amendment","Because the Supreme Court decides","Because Congress votes after each term"]),
40:("The Vice President",["The Speaker of the House","The Chief Justice","The Secretary of State"]),41:(None,["Writes laws","Declares war","Reviews laws"]),42:("The President",["The Secretary of Defense","The Vice President","The Chief Justice"]),
43:("The President",["The Chief Justice","The Speaker of the House","The Vice President"]),44:("The President",["The Senate","The Supreme Court","The Speaker of the House"]),45:("The President",["Congress","The Chief Justice","State governors"]),
46:("Cabinet",["Supreme Court","Senate","House of Representatives"]),47:("Advises the President",["Writes laws","Reviews laws","Commands the military"]),48:("Attorney General and Secretary of State",["Speaker of the House and Chief Justice","Governor and mayor","Senator and representative"]),
49:(None,["It writes the federal budget.","It appoints Supreme Court justices.","It counts the population every 10 years."]),50:(None,["The Senate","The Cabinet","The Electoral College"]),51:(None,["Writes laws","Enforces laws","Declares war"]),
52:(None,["Court of Appeals","District Court","State Supreme Court"]),53:(None,["Seven (7)","Twelve (12)","Fifteen (15)"]),54:(None,["Three (3)","Nine (9)","Seven (7)"]),55:("For life",["Four (4) years","Ten (10) years","Until the president leaves office"]),
56:("To be independent of politics",["So they can run for office later","To represent their home state","Because elections cost too much"]),58:(None,["Provide schooling and education","Give a driver's license","Approve zoning and land use"]),
59:(None,["Print paper money","Declare war","Make treaties"]),60:("Powers not given to the federal government belong to the states or to the people.",["It gives women the right to vote.","It ends slavery.","It sets the president's term limit."]),
63:("Citizens eighteen (18) and older can vote.",["Only people who own land can vote.","Voters must pay a poll tax.","Only men can vote."]),64:("U.S. citizens",["Anyone living in the United States","Permanent residents","Anyone who pays taxes"]),
65:("Freedom of speech, freedom of religion, and freedom of assembly",["Voting in federal elections, running for federal office, and serving on a jury","Free housing, free food, and free travel","A passport, a federal job, and a pension"]),
66:(None,["The president","The state governor","Congress"]),67:("Give up loyalty to other countries and defend the Constitution",["Vote in every election and join a political party","Never travel abroad and learn two languages","Pay extra taxes and buy a home"]),
68:("Naturalize",["Live in the United States for one year","Pay federal taxes for five years","Get a driver's license"]),69:("Vote and run for office",["Watch television and shop","Travel abroad and learn a language","Drive a car and own a pet"]),
70:("Serve in the military",["Move to another country","Avoid jury duty","Refuse to pay taxes"]),71:(None,["It is optional","Taxes pay only the president's salary","Only citizens must pay taxes"]),
72:(None,["It gives the right to vote","It is needed to get a passport","It replaces paying taxes"]),73:("Religious freedom",["To join the British army","To escape the American Revolution","To pay higher taxes"]),
74:(None,["Canadians","Pilgrims","Spanish settlers"]),75:(None,["Europeans","American Indians","Asians"]),76:("The American Revolution",["The Civil War","The War of 1812","World War I"]),
77:("Taxation without representation",["To end slavery","To join France","Because Britain lost a war with Spain"]),78:("Thomas Jefferson",["George Washington","Abraham Lincoln","James Madison"]),
79:(None,["July 4, 1787","September 17, 1787","December 7, 1941"]),80:("Battle of Bunker Hill",["Battle of Gettysburg","Attack on Pearl Harbor","Louisiana Purchase"]),
81:("New York, New Jersey, Virginia, Georgia and Massachusetts",["Ohio, Texas, Florida, California and Maine","Vermont, Kentucky, Tennessee, Ohio and Indiana","Alaska, Hawaii, Arizona, Utah and Nevada"]),
82:("The U.S. Constitution",["Declaration of Independence","Emancipation Proclamation","Federalist Papers"]),83:("James Madison",["Thomas Jefferson","George Washington","Benjamin Franklin"]),
84:("They helped people understand the Constitution.",["They declared independence from Britain.","They ended slavery.","They created the national bank."]),85:("First Postmaster General of the United States",["First president of the United States","Wrote the Star-Spangled Banner","General of the Continental Army"]),
86:("First president of the United States",["Wrote the Declaration of Independence","Freed the slaves","First Secretary of the Treasury"]),87:("Writer of the Declaration of Independence",["Father of the Constitution","First president of the United States","General of the Continental Army"]),
88:("Father of the Constitution",["First Secretary of the Treasury","Wrote the Declaration of Independence","First Postmaster General"]),89:("First Secretary of the Treasury",["Third president of the United States","Father of Our Country","Freed the slaves"]),
90:("Louisiana Territory",["Alaska","Florida","Texas"]),91:("Civil War",["World War I","Korean War","Revolutionary War"]),92:(None,["The Revolutionary War","The War of 1812","World War II"]),
93:("Emancipation Proclamation",["Boston Tea Party","Attack on Pearl Harbor","Battle of Yorktown"]),94:("Freed the slaves (Emancipation Proclamation)",["First president of the United States","Wrote the Declaration of Independence","President during World War II"]),
95:(None,["Gave women the right to vote","Ended the Revolutionary War","Created the Supreme Court"]),96:(None,["The Revolutionary War","World War I","The War of 1812"]),97:(None,["1st Amendment","19th Amendment","22nd Amendment"]),
98:("After the Civil War",["After World War II","In 1776","After the Vietnam War"]),99:("Susan B. Anthony",["Betsy Ross","Eleanor Roosevelt","Rosa Parks"]),100:("World War II",["Civil War","War of 1812","Mexican-American War"]),
101:("Because Germany attacked U.S. civilian ships",["Because of the bombing of Pearl Harbor","To stop the spread of communism","To force the Iraqi military from Kuwait"]),102:("1920",["1776","1865","1965"]),
103:(None,["A disease outbreak","A long war between the states","An oil shortage in the 1970s"]),104:("The stock market crash of 1929",["The end of World War II","The attack on Pearl Harbor","The end of the Civil War"]),
105:("Franklin Roosevelt",["Harry Truman","Woodrow Wilson","Dwight Eisenhower"]),106:("Japan attacked Pearl Harbor",["To stop the spread of communism","To win independence from Britain","To force the Iraqi military from Kuwait"]),
107:("General during World War II",["President during the Civil War","Wrote the Constitution","First person on the moon"]),108:("Soviet Union",["China","Germany","Japan"]),109:("Communism",["High taxes from Britain","Slavery","The Great Depression"]),
110:(None,["To free Kuwait","Because of Pearl Harbor","To win independence"]),111:(None,["To force Iraq out of Kuwait","Because Germany attacked U.S. ships","To end slavery"]),112:(None,["Fought for independence from Britain","Fought to lower taxes","Fought to stop communism"]),
113:("Fought for civil rights",["First African American president","General during World War II","Wrote the Emancipation Proclamation"]),114:(None,["To stop the spread of communism","Because of the September 11 attacks","To support the Allied Powers"]),
115:("Terrorists attacked the United States",["The stock market crashed","Japan attacked Pearl Harbor","The Cold War ended"]),116:("War in Afghanistan",["Persian Gulf War","Vietnam War","Korean War"]),117:("Cherokee",["Inca","Maya","Zulu"]),
118:("Light bulb",["The printing press","Gunpowder","The compass"]),119:(None,["New York City","Philadelphia","Los Angeles"]),120:("New York Harbor",["Washington, D.C.","Boston Harbor","San Francisco Bay"]),
121:("Because there were 13 original colonies",["Because 13 states fought in the Civil War","Because the Constitution has 13 articles","Because there are 13 federal holidays"]),
122:("Because there is one star for each state",["Because there were 50 original colonies","Because there are 50 senators","Because the Constitution has 50 amendments"]),123:(None,["America the Beautiful","God Bless America","The Pledge of Allegiance"]),
124:(None,["In God we trust","Liberty and justice for all","We the People"]),125:("A holiday to celebrate U.S. independence from Britain",["A holiday to honor soldiers who died","A holiday to honor workers","The day the Constitution was signed"]),
126:("Memorial Day, Independence Day and Thanksgiving",["Valentine's Day, Halloween and Easter","Election Day, Tax Day and Flag Day","Earth Day, Super Bowl Sunday and April Fools' Day"]),
127:(None,["A holiday to honor everyone who has served in the military","A holiday to celebrate U.S. independence","A holiday to honor workers"]),128:("A holiday to honor people who have served in the U.S. military",["A holiday to honor soldiers who died in military service","A holiday to celebrate U.S. independence","A holiday to honor presidents"])}
OFF={30:"speaker",38:"president",39:"vp",57:"chief"}
clean=lambda a:re.sub(r"\s+"," ",re.sub(r"\[.*?\]","",a).replace("(","").replace(")","")).strip()
D=json.load(open('free/civics.json')); out=["/* Free apps: U.S. citizenship civics test (USCIS 2025 version, 128 questions). Generated by gen_free_banks.py. */"]
nq=nf=0
for d in D:
    n=d['n']; dom=1 if n<=72 else 2 if n<=118 else 3; ans=[clean(a) for a in d['a'] if clean(a)]
    vary=n in (23,29,61,62)
    if n in OFF:
        cur=NOW.get(n)
        if cur:
            others=[x for x in names if x!=cur][:3]
            out.append(f'F(11,{dom},{J(d["q"])},{J(cur+". Names change after elections and appointments: confirm at uscis.gov/citizenship/testupdates before your interview.")});'); nf+=1
            if len(others)==3: out.append(f'Q(11,{dom},1,{J(d["q"])},{J(cur)},{J(others)},{J("Checked "+CHK+". You must name the person serving on the day of your interview; confirm at uscis.gov/citizenship/testupdates.")});'); nq+=1
        continue
    back=("Your answer depends on where you live. "+ans[0]) if vary else (" · ".join(ans[:8])+(" · and more" if len(ans)>8 else ""))
    out.append(f'F(11,{dom},{J(d["q"])},{J(back)});'); nf+=1
    if n in W:
        c,w=W[n]; c=c or ans[0]; assert c not in w,(n,c)
        ex="Official USCIS answers: "+"; ".join(ans[:6])+("; and more." if len(ans)>6 else ".")+(" On the 65/20 list." if d.get('star') else "")
        out.append(f'Q(11,{dom},{1 if d.get("star") else 2},{J(d["q"])},{J(c)},{J(w)},{J(ex)});'); nq+=1
open('cit_bank.js','w').write("\n".join(out)+"\n"); print('citizenship cards',nf,'questions',nq)
def rows(f): return [l.rstrip("\n").split("|") for l in open(f) if l.strip() and not l.startswith("#")]
out=["/* Free apps: driver's license knowledge test. Generated by gen_free_banks.py from free/car.txt and free/state/*.txt */"]; n=0
for r in rows('free/car.txt'):
    dom=1 if re.search(r"sign|signal|light|line|marking|arrow|curb",r[0],re.I) else 2
    out.append(f'Q(12,{dom},1,{J(r[0])},{J(r[1])},{J(r[2:5])},{J(r[5] if len(r)>5 else "")});'); out.append(f'F(12,{dom},{J(r[0])},{J(r[1]+". "+(r[5] if len(r)>5 else ""))});'); n+=1
ST=[("colorado","Colorado"),("california","California"),("texas","Texas"),("florida","Florida"),("new-york","New York"),("pennsylvania","Pennsylvania"),("ohio","Ohio"),("georgia","Georgia"),("michigan","Michigan"),("north-carolina","North Carolina"),("illinois","Illinois"),("new-jersey","New Jersey"),("virginia","Virginia"),("washington","Washington"),("maryland","Maryland"),("missouri","Missouri"),("arizona","Arizona"),("massachusetts","Massachusetts"),("tennessee","Tennessee")]
for i,(f,name) in enumerate(ST):
    for r in rows(f'free/state/{f}.txt'):
        out.append(f'Q(12,{3+i if 3+i<20 else 4+i},2,{J(name+": "+r[0])},{J(r[1])},{J(r[2:5])},{J(r[5] if len(r)>5 else "")});'); out.append(f'F(12,{3+i if 3+i<20 else 4+i},{J(name+": "+r[0])},{J(r[1]+". "+(r[5] if len(r)>5 else ""))});'); n+=1
open('drive_bank.js','w').write("\n".join(out)+"\n"); print('driving questions',n)
DRV_M=[]
out=["/* Free apps: motorcycle permit test. Generated by gen_free_banks.py from free/moto.txt */"]; n=0
for r in rows('free/moto.txt'):
    dom=2 if re.search(r"helmet|gear|passenger|alcohol|drink|cloth|eye|visib|jacket|glove",r[0],re.I) else 1
    out.append(f'Q(13,{dom},1,{J(r[0])},{J(r[1])},{J(r[2:5])},{J(r[5] if len(r)>5 else "")});'); out.append(f'F(13,{dom},{J(r[0])},{J(r[1]+". "+(r[5] if len(r)>5 else ""))});'); n+=1
    DRV_M.append(f'Q(12,20,1,{J("Motorcycle: "+r[0])},{J(r[1])},{J(r[2:5])},{J(r[5] if len(r)>5 else "")});'); DRV_M.append(f'F(12,20,{J("Motorcycle: "+r[0])},{J(r[1]+". "+(r[5] if len(r)>5 else ""))});')
open('moto_bank.js','w').write("\n".join(out)+"\n"); print('motorcycle questions',n)
open('drive_bank.js','a').write("/* Motorcycle add-on inside the driving app (domain 20) */\n"+"\n".join(DRV_M)+"\n")
