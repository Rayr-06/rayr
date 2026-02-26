import pandas as pd
import time
from rayr_navigator import RAYRNavigator
from rayr_brain import RAYRBrain
from datetime import datetime

class RAYRRunner:
    def __init__(self, excel_file):
        self.excel_file = excel_file
        self.navigator = RAYRNavigator()
        self.brain = RAYRBrain()
        self.results = []
        
    def read_test_cases(self):
        """Read ANY Excel/CSV format - handles any columns"""
        try:
            # Try different formats
            if self.excel_file.endswith('.xlsx'):
                df = pd.read_excel(self.excel_file, sheet_name=None)
            else:
                df = pd.read_csv(self.excel_file)
            
            print(f"📊 Loaded test cases from {self.excel_file}")
            return df
        except Exception as e:
            print(f"❌ Error reading file: {e}")
            return None
    
    def parse_step(self, row):
        """Convert any row format to action"""
        # Look for common column names
        action_cols = ['action', 'step', 'test_step', 'description']
        target_cols = ['target', 'element', 'button', 'object']
        value_cols = ['value', 'expected', 'result']
        
        action = None
        for col in action_cols:
            if col in row and pd.notna(row[col]):
                action = str(row[col])
                break
                
        return {
            'action': action or 'tap',
            'description': str(row.get('description', row.get('test case', ''))),
            'expected': str(row.get('expected result', row.get('expected', '')))
        }
    
    def run_test_case(self, test_case):
        print(f"\n🧪 Running: {test_case['description']}")
        
        # Clear any popups first
        self.navigator.clear_all_blockers()
        
        # Execute the action
        if 'tap' in test_case['action'].lower():
            # AI decides where to tap
            analysis = self.brain.analyze_screenshot(
                self.navigator.take_screenshot("before_action")
            )
            
            if analysis['coords']:
                self.navigator.tap(analysis['coords'][0], analysis['coords'][1])
                time.sleep(3)
        
        # Verify result
        verification = self.navigator.verify_result(test_case['expected'])
        
        # Check for bugs
        bug_check = self.brain.detect_bug(
            self.navigator.take_screenshot("after_action"),
            test_case['expected']
        )
        
        result = {
            'test_case': test_case['description'],
            'timestamp': datetime.now().isoformat(),
            'success': verification['screen_type'] != 'crash',
            'bug_found': bug_check['has_bug'],
            'bug_details': bug_check if bug_check['has_bug'] else None,
            'screenshot': verification.get('screenshot', '')
        }
        
        self.results.append(result)
        return result
    
    def generate_report(self):
        """Create HTML report"""
        html = f"""
        <html>
        <head><title>RAYR Test Report</title>
        <style>
            body {{ font-family: Arial; margin: 20px; }}
            .pass {{ color: green; }}
            .fail {{ color: red; }}
            .bug {{ background: #ffeeee; padding: 10px; }}
        </style>
        </head>
        <body>
        <h1>RAYR Test Execution Report</h1>
        <p>Generated: {datetime.now()}</p>
        <p>Total tests: {len(self.results)}</p>
        <p>Passed: {sum(1 for r in self.results if r['success'])}</p>
        <p>Failed: {sum(1 for r in self.results if not r['success'])}</p>
        <p>Bugs found: {sum(1 for r in self.results if r['bug_found'])}</p>
        
        <table border="1">
        <tr><th>Test</th><th>Result</th><th>Bug?</th></tr>
        """
        
        for r in self.results:
            color = 'green' if r['success'] else 'red'
            html += f"""
            <tr>
                <td>{r['test_case']}</td>
                <td style="color:{color}">{'PASS' if r['success'] else 'FAIL'}</td>
                <td>{'🐛 YES' if r['bug_found'] else '✓'}</td>
            </tr>
            """
            
        html += "</table></body></html>"
        
        filename = f"rayr_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        with open(filename, 'w') as f:
            f.write(html)
            
        print(f"📊 Report saved: {filename}")
        return filename
    
    def run_all(self):
        print("🚀 RAYR Test Runner Started")
        print("="*50)
        
        # Read test cases
        test_data = self.read_test_cases()
        if test_data is None:
            return
            
        # Handle different formats
        if isinstance(test_data, dict):
            # Multiple sheets
            for sheet_name, sheet_df in test_data.items():
                print(f"\n📑 Testing sheet: {sheet_name}")
                for _, row in sheet_df.iterrows():
                    test_case = self.parse_step(row)
                    self.run_test_case(test_case)
        else:
            # Single sheet
            for _, row in test_data.iterrows():
                test_case = self.parse_step(row)
                self.run_test_case(test_case)
        
        # Generate report
        report = self.generate_report()
        print(f"\n✅ Testing complete! Report: {report}")

if __name__ == "__main__":
    excel_file = input("📂 Enter Excel file name: ").strip()
    runner = RAYRRunner(excel_file)
    runner.run_all()