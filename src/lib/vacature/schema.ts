import { z } from 'zod';

export const vacatureSchema = z.object({
    functietitel: z.string().describe('De functietitel van de vacature'),
    bedrijf: z.string().nullable().describe('Het bedrijf dat de vacature aanbiedt'),
    niveau: z.enum(['junior', 'medior', 'senior', 'onbekend']).describe('Het niveau van de vacature'),
    salarisMin: z.number().int().nullable().describe('Het minimale salaris van de vacature in euros'),
    vaardigheden: z.array(z.string()).describe('De vaardigheden die nodig zijn voor de vacature'),
    remote: z.boolean().nullable().describe('Of het een mogelijkheid is om vanuit huis te werken'),
})
export type Vacature = z.infer<typeof vacatureSchema>;
