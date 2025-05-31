"use client";

import { useEffect, useState } from "react";

// Unix/programming commands to display
const commands = [
  // Basic Unix
  "ls", "cd", "pwd", "mkdir", "touch", "rm", "grep", "find",
  "cat", "less", "head", "tail", "cp", "mv", "chmod", "chown",
  "ps", "kill", "top", "df", "du", "tar", "gzip", "ssh",
  "scp", "curl", "wget", "ping", "traceroute", "ifconfig",
  
  // Git
  "git clone", "git add", "git commit", "git push", "git pull", "git merge",
  "git checkout", "git branch", "git status", "git log", "git rebase",
  
  // Python (all open source)
  "python", "python3", "pip install", "pip freeze", "venv", "virtualenv", 
  "pytest", "flask run", "django-admin", "uvicorn", "gunicorn",
  "numpy", "pandas", "tensorflow",
  "sklearn", "async def", "def __init__", "@dataclass", "pytest", "pyenv", "poetry", "black", "mypy", "ruff", "isort",
   "with open()", "try: except:",
  
  // Databases (OSS only)
  "SELECT * FROM", "INSERT INTO", "UPDATE", "DELETE FROM", "JOIN",
  "CREATE TABLE", "DROP TABLE", "ALTER TABLE", "ORDER BY",
  "WHERE id =", "GROUP BY", "HAVING", "LIMIT", "OFFSET",
  "postgres", "mysql", "sqlite3", "redis-cli", 'valkey',
  "EXPLAIN ANALYZE", "CREATE INDEX", "BEGIN", "COMMIT", "ROLLBACK",
  
  // Node/JS
  "npm install", "npm start", "npm run build", "npm test", "yarn add",
  "node", "npx", "tsc", "eslint", "prettier", "webpack",
  // Containers & Orchestration (all OSS)
  "docker run", "docker build", "docker push", "docker pull",
  "kubectl", "helm", "k3s", "k9s", "podman", "containerd",
  "kustomize", "cilium", "etcd", "prometheus", "docker-compose",
  
  // Cloud-native concepts (keeping it OSS focused)
  "serverless", "containers", "faas", "microservices", "scaling", 
  "load balancer", "object storage", "functions", "iac", "pubsub",
  
  // Programming languages & build tools (all OSS)
  "make", "cmake", "gcc", "clang", "rustc", "cargo", "scalac", "ghc", "erlang",
  "elixir","perl", "lua", "haskell", "zig",
  "nim", "lisp", "scheme", "racket",
  
  // Editors (only OSS ones)
  "vim", "emacs", "nano", "neovim",
  
  // Common one-liners & system operations
  "| grep", "| sort", "| uniq", "| wc -l", "| xargs", ">> output.txt",
  "> /dev/null", "2>&1", "sudo !!", "&&", "||", ";", "#!/bin/bash",
  "systemctl restart", "journalctl -f", "dmesg", "tail -f /var/log/",
  "iptables -L", "netstat -tuln", "ss -tuln", "tcpdump", "strace",
  "lsof -i", "htop", "free -h", "df -h", "mount", "fdisk -l", 
  "rsync -avz", "crontab -e", "whois", "dig", "nmap", "nc", "openssl"
];

type FallingCommand = {
  id: number;
  command: string;
  x: number;
  y: number;
  speed: number;
  size: number;
};

export default function BackgroundRain() {
  const [fallingCommands, setFallingCommands] = useState<FallingCommand[]>([]);
  
  useEffect(() => {
    // Create initial set of commands
    const initialCommands: FallingCommand[] = [];
    const commandCount = 21; // Reduced count for better performance
    const usedCommands = new Set<string>(); // Track used commands
    
    for (let i = 0; i < commandCount; i++) {
      const cmd = createRandomCommand(i, usedCommands);
      usedCommands.add(cmd.command); // Mark as used
      initialCommands.push(cmd);
    }
    
    setFallingCommands(initialCommands);
    
    // Use requestAnimationFrame for more efficient animation
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 30; // Limit to 30fps
    const interval = 1000 / fps;
    
    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Throttle to desired fps
      const delta = currentTime - lastTime;
      if (delta < interval) return;
      
      lastTime = currentTime - (delta % interval);
      
      setFallingCommands(prevCommands => {
        const commandsInUse = new Set(
          prevCommands
            .filter(cmd => cmd.y <= 100) // Only count commands still on screen
            .map(cmd => cmd.command)
        );
        
        return prevCommands.map(cmd => {
          // Update y position
          const newY = cmd.y + cmd.speed;
          
          // Reset if it goes off screen
          if (newY > 100) {
            // Remove this command from in-use set
            commandsInUse.delete(cmd.command);
            // Create new command ensuring no duplicate
            return createRandomCommand(cmd.id, commandsInUse);
          }
          
          return { ...cmd, y: newY };
        });
      });
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  // Create a random command element with no duplicates
  function createRandomCommand(id: number, usedCommands: Set<string>): FallingCommand {
    // Filter out already used commands
    const availableCommands = commands.filter(cmd => !usedCommands.has(cmd));
    
    // If running out of unique commands, just pick any
    const commandsToChooseFrom = availableCommands.length > 10 ? availableCommands : commands;
    
    // Get random command
    const randomIndex = Math.floor(Math.random() * commandsToChooseFrom.length);
    const commandText = commandsToChooseFrom[randomIndex];
    
    // Small chance of adding a dollar sign prompt for more terminal feel
    const showPrompt = Math.random() < 0.15;
    const finalText = showPrompt ? "$ " + commandText : commandText;
    
    // Add to used set
    usedCommands.add(commandText);
    
    return {
      id,
      command: finalText,
      x: Math.random() * 100, // Random x position (0-100%)
      y: Math.random() * -100, // Start above the screen
      speed: 0.2 + Math.random() * 0.8, // Random speed
      size: 0.6 + Math.random() * 0.5, // Slightly smaller size for better fit
    };
  }
  
  useEffect(() => {
    console.log("BackgroundRain mounted with", fallingCommands.length, "commands");
  }, [fallingCommands.length]);

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden bg-[linear-gradient(135deg,rgba(154,3,30,0.9),rgba(10,36,99,0.9))]">
      {fallingCommands.map(cmd => (
        <div
          key={cmd.id}
          className="absolute whitespace-nowrap font-mono font-bold z-20"
          style={{
            left: `${cmd.x}%`,
            top: `${cmd.y}%`,
            fontSize: `${cmd.size}rem`,
            opacity: 0.9,
            color: "#C8B1F5", // Brighter lavender color
            transition: 'opacity 0.2s ease',
            textRendering: 'geometricPrecision',
            fontSmooth: 'never',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'never',
            textShadow: '0 0 2px rgba(159, 123, 216, 0.5)' // Subtle glow
          }}
        >
          {cmd.command}
        </div>
      ))}
    </div>
  );
}
