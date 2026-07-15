import subprocess
import re
import os
import json
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
KB_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "../../../../knowledge-base"))

def run_command(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

def get_releases(target_version=None):
    if target_version:
        pattern = f"origin/release_{target_version}"
    else:
        pattern = "origin/release_1.*"
    
    branches_raw = run_command(f'git branch -r --list "{pattern}" --format="%(refname:short)"')
    releases = {}
    for line in branches_raw.split('\n'):
        if not line: continue
        name = line.strip().replace('origin/release_', '')
        releases[name] = {'branch': line.strip()}
    
    return releases

def get_task_info(task_id):
    path = os.path.join(KB_ROOT, f'jira/GWAL/issues/{task_id}.json')
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('fields', {}).get('summary', task_id)
        except:
            pass
    
    path_md = os.path.join(KB_ROOT, f'jira/GWAL/issues/{task_id}.md')
    if os.path.exists(path_md):
        try:
            with open(path_md, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('# '):
                        return line[2:].strip()
        except:
            pass
    return task_id

def extract_tasks(commits):
    tasks = []
    for msg in commits:
        match = re.search(r'((GWAL|WAL)-\d+)', msg)
        if match:
            tasks.append(match.group(1))
    return sorted(list(set(tasks)))

target_version = sys.argv[1] if len(sys.argv) > 1 else None

if not target_version:
    try:
        sys.stderr.write("Enter version (example 1.16.10): ")
        sys.stderr.flush()
        input_ver = sys.stdin.readline().strip()
        if input_ver:
            target_version = input_ver
    except EOFError:
        pass

releases = get_releases(target_version)
sorted_versions = sorted(releases.keys(), key=lambda x: [int(i) for i in x.split('.')])

for i, ver in enumerate(sorted_versions):
    branch = releases[ver]['branch']
    
    path_filter = ""
    ls_check = run_command(f'git ls-tree -d {branch} packages/checkout')
    if ls_check:
        path_filter = "-- packages/checkout"
    
    if i > 0:
        prev_branch = releases[sorted_versions[i-1]]['branch']
        merge_base_proc = subprocess.run(f'git merge-base {prev_branch} {branch}', shell=True, capture_output=True, text=True)
        merge_base = merge_base_proc.stdout.strip()
        
        if merge_base_proc.returncode == 0 and merge_base:
            has_path_in_base = run_command(f'git ls-tree -d {merge_base} packages/checkout')
            
            effective_filter = path_filter if has_path_in_base else ""
            cmd = f'git log {merge_base}..{branch} --pretty=format:"%s" {effective_filter}'
        else:
            cmd = f'git log {branch} --pretty=format:"%s" -n 50 {path_filter}'
    else:
        cmd = f'git log {branch} --pretty=format:"%s" -n 50 {path_filter}'
    
    commits = run_command(cmd).split('\n')
    actual_commits = [c.strip() for c in commits if c.strip()]
    
    releases[ver]['commits'] = actual_commits
    task_ids = extract_tasks(actual_commits)
    releases[ver]['tasks'] = [{'id': tid, 'summary': get_task_info(tid)} for tid in task_ids]

print(json.dumps(releases, indent=2))
