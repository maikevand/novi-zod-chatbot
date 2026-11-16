'use server';

import type { Vacature } from '@/lib/vacature/schema';
import { vacatureSchema } from '@/lib/vacature/schema';
import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';

export type VacatureResultaat = {
  vacature?: Vacature;
  error?: string;
};

export async function extractVacature(tekst: string): Promise<VacatureResultaat> {
  if (tekst.trim().length === 0) {
    return { error: "Vul eerst een vacaturetekst in." }
    } else if (tekst.trim().length > 10000) {
    return {error: "Er zijn maximaal 10.000 tekens toegestaan."}
    }
    try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: "Je bent een vacatureanalist. Analyseer vacatureteksten en haal de belangrijkste gegevens eruit.",  
      prompt: `Analyseer de volgende vacaturetekst: ${tekst}`,
      output: Output.object({ schema: vacatureSchema }),
    });
    return { vacature: result.output };
  } catch (error) {
    return { error: "Er is een fout opgetreden bij het analyseren van de vacaturetekst." }
  }
}
