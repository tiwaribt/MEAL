import { Injectable, signal } from '@angular/core';

export interface AiAssistResponse {
  result: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistService {
  readonly isLoading = signal<boolean>(false);
  readonly lastError = signal<string | null>(null);

  async generate(action: 'generate-indicator' | 'draft-case-study' | 'analyze-cfrm' | 'generate-donor-summary' | 'general', prompt: string, context?: Record<string, unknown>): Promise<string> {
    this.isLoading.set(true);
    this.lastError.set(null);

    try {
      const response = await fetch('/api/meal/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, prompt, context })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AiAssistResponse = await response.json();
      this.isLoading.set(false);
      return data.result;
    } catch (err: unknown) {
      console.error('AI Assist error:', err);
      this.isLoading.set(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete AI request';
      this.lastError.set(errorMessage);

      // Fallback domain response
      if (action === 'generate-indicator') {
        return `### Performance Indicator Reference Sheet (PIRS)
**Indicator Title:** Number of target public schools retrofitted to survive Intensity IX earthquakes
- **Indicator Level:** Outcome (SSEP-OC-1.2)
- **Unit of Measure:** Number of certified resilient educational facilities
- **Baseline:** 0
- **Annual Target:** 24 school blocks
- **Disaggregation:** By Municipality, Primary vs Secondary, and Disabled Accessible
- **Data Source / MoV:** Structural Engineer Certification & Municipal Permit
- **Collection Frequency:** Bi-annual`;
      }

      return 'MEAL technical assistant could not reach backend. Please review network connection.';
    }
  }
}
