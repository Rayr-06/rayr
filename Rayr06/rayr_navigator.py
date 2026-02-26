import time
import subprocess
from rayr_brain import RAYRBrain

class RAYRNavigator:
    def __init__(self, package_name="com.zynga.hititrich"):
        self.package = package_name
        self.brain = RAYRBrain()
        self.adb = "C:\\platform-tools\\adb.exe"
        
    def clear_all_blockers(self):
        """
        Keep clearing popups until game is ready:
        - MOTD messages
        - Sales offers
        - Rate us prompts
        - Permission dialogs
        - Loading screens
        """
        max_attempts = 10
        attempt = 0
        
        while attempt < max_attempts:
            screenshot = self.take_screenshot()
            analysis = self.brain.analyze_screenshot(screenshot)
            
            if analysis["screen_type"] == "game_ready":
                print("✅ Game ready for testing")
                return True
                
            if analysis["blocking_elements"]:
                for blocker in analysis["blocking_elements"]:
                    print(f"🚫 Clearing blocker: {blocker['type']}")
                    self.tap(blocker["coords"][0], blocker["coords"][1])
                    time.sleep(2)
            else:
                # Try common close positions
                common_closes = [(1320, 180), (1380, 100), (720, 200)]
                for x, y in common_closes:
                    self.tap(x, y)
                    time.sleep(1)
                    
            attempt += 1
            
        return False
    
    def take_screenshot(self, name="screen"):
        filename = f"navigator_{name}_{datetime.now().strftime('%H%M%S')}.png"
        subprocess.run([self.adb, "exec-out", "screencap", "-p"], 
                      stdout=open(filename, "wb"))
        return filename
    
    def tap(self, x, y):
        subprocess.run([self.adb, "shell", "input", "tap", str(x), str(y)])
        
    def verify_result(self, expected):
        """Check if expected result happened"""
        screenshot = self.take_screenshot("verification")
        return self.brain.analyze_screenshot(screenshot)