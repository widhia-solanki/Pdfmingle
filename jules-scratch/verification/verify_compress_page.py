from playwright.sync_api import sync_playwright, Page, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the compress PDF tool page
        page.goto("http://localhost:3000/compress-pdf")

        # Check if the main heading is visible
        heading = page.get_by_role("heading", name="Compress PDF Files")
        expect(heading).to_be_visible()

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()
