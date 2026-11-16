'use server';

import type { Vacature } from '@/lib/vacature/schema';
import { vacatureSchema } from '@/lib/vacature/schema';
import { openai } from '@ai-sdk/openai';
import { generateText, Output, NoObjectGeneratedError } from 'ai';
import { saveVacature } from '@/lib/vacature/cruds';

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
      system: "Je bent een vacatureanalist. Analyseer vacatureteksten en haal de belangrijkste gegevens eruit. Als je informatie niet kunt vinden, verzin deze dan niet.",  
      prompt: `Analyseer de volgende vacaturetekst: ${tekst}`,
      output: Output.object({ schema: vacatureSchema }),
    });
    const vaardigheden = result.output.vaardigheden;
    const uniekeVaardigheden = new Set(vaardigheden);
    if (vaardigheden.length !== uniekeVaardigheden.size) {
      return { error: "Er zijn dubbele vaardigheden gevonden in het analyseren van de vacaturetekst." }
    }
    await saveVacature(result.output, tekst);
    return { vacature: result.output };
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      console.error("Geen geldig object:", error);
    } else {
      console.error(error);
    }
    return { error: "Er is een fout opgetreden bij het analyseren van de vacaturetekst." }
}
}
