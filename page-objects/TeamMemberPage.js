import { Page } from '@playwright/test';

export class TeamMemberPage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.url = '/dashboard';
        this.launchSurveyButton = page.locator('button:has-text("Launch Pulse Survey")');
        this.surveyModal = page.locator('.survey-modal');
        // Attribute sliders/inputs (Happiness, Energy, Job Satisfaction, Stress, Purpose)
        this.happinessSlider = page.locator('input[name="happiness"]');
        this.energySlider = page.locator('input[name="energy"]');
        this.satisfactionSlider = page.locator('input[name="satisfaction"]');
        this.stressSlider = page.locator('input[name="stress"]');
        this.purposeSlider = page.locator('input[name="purpose"]');
        this.feedbackTextarea = page.locator('textarea[name="feedback"]');
        this.submitSurveyButton = page.locator('button:has-text("Submit Pulse")');
        this.personalTimeline = page.locator('.personal-sentiment-timeline');
        this.editLastSubmissionButton = page.locator('button:has-text("Edit Last Submission")');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async submitPulse(scores, feedback) {
        await this.launchSurveyButton.click();
        await this.happinessSlider.fill(scores.happiness.toString());
        await this.energySlider.fill(scores.energy.toString());
        await this.satisfactionSlider.fill(scores.satisfaction.toString());
        await this.stressSlider.fill(scores.stress.toString());
        await this.purposeSlider.fill(scores.purpose.toString());
        if (feedback) {
            await this.feedbackTextarea.fill(feedback);
        }
        await this.submitSurveyButton.click();
    }

    async getLocalStorageHistory() {
        return await this.page.evaluate(() => JSON.parse(localStorage.getItem('pulse_history') || '[]'));
    }
}
