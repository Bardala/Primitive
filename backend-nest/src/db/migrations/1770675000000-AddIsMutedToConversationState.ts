import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsMutedToConversationState1770675000000 implements MigrationInterface {
  name = 'AddIsMutedToConversationState1770675000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only add the column if it doesn't exist
    const table = await queryRunner.getTable('user_conversation_state');
    if (table && !table.findColumnByName('isMuted')) {
      await queryRunner.query(
        `ALTER TABLE \`user_conversation_state\` ADD \`isMuted\` tinyint NOT NULL DEFAULT 0`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_conversation_state');
    if (table && table.findColumnByName('isMuted')) {
      await queryRunner.query(`ALTER TABLE \`user_conversation_state\` DROP COLUMN \`isMuted\``);
    }
  }
}
