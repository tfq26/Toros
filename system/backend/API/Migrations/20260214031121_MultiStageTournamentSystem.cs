using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Toros.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MultiStageTournamentSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RegisteredPlayerIds",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "SetupProperties",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "SetupPropertiesMap",
                table: "Tournaments");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tournaments");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.AddColumn<string>(
                name: "StageId",
                table: "Matches",
                type: "text",
                nullable: true);

            // --- Missing Schema Changes & Enum Fixes ---

            // Users: Remove old relation, Add new fields, Fix Role/Status
            migrationBuilder.Sql("ALTER TABLE \"Users\" DROP CONSTRAINT IF EXISTS \"FK_Users_Players_PlayerProfileId\";");
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_Users_PlayerProfileId\";");
            migrationBuilder.Sql("ALTER TABLE \"Users\" DROP COLUMN IF EXISTS \"PlayerProfileId\";");

            migrationBuilder.Sql("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"ContactInfo\" text;");
            migrationBuilder.Sql("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"Age\" integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"SkillLevel\" integer NOT NULL DEFAULT 0;");
            migrationBuilder.Sql("ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"Status\" integer NOT NULL DEFAULT 0;");
            
            // Fix Users.Role (String -> Int)
            migrationBuilder.Sql(
                "DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Users' AND column_name = 'Role' AND data_type = 'text') THEN " +
                "ALTER TABLE \"Users\" ALTER COLUMN \"Role\" TYPE integer USING (" +
                "CASE \"Role\" " +
                "WHEN 'User' THEN 0 " +
                "WHEN 'Admin' THEN 1 " +
                "WHEN 'Referee' THEN 2 " +
                "ELSE 0 END)::integer; END IF; END $$;");

            // Fix Teams.Status
            migrationBuilder.Sql(
                "DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Teams' AND column_name = 'Status' AND data_type = 'text') THEN " +
                "ALTER TABLE \"Teams\" ALTER COLUMN \"Status\" TYPE integer USING (" +
                "CASE \"Status\" " +
                "WHEN 'Registered' THEN 0 " +
                "WHEN 'Active' THEN 1 " +
                "WHEN 'Eliminated' THEN 2 " +
                "ELSE 0 END)::integer; END IF; END $$;");

            // Fix Matches.Status
            migrationBuilder.Sql(
                "DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Matches' AND column_name = 'Status' AND data_type = 'text') THEN " +
                "ALTER TABLE \"Matches\" ALTER COLUMN \"Status\" TYPE integer USING (" +
                "CASE \"Status\" " +
                "WHEN 'Pending' THEN 0 " +
                "WHEN 'Ongoing' THEN 1 " +
                "WHEN 'Completed' THEN 2 " +
                "ELSE 0 END)::integer; END IF; END $$;");

            // Fix Tournaments.Status
             migrationBuilder.Sql(
                "DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Tournaments' AND column_name = 'Status' AND data_type = 'text') THEN " +
                "ALTER TABLE \"Tournaments\" ALTER COLUMN \"Status\" TYPE integer USING (" +
                "CASE \"Status\" " +
                "WHEN 'Draft' THEN 0 " +
                "WHEN 'Open' THEN 1 " +
                "WHEN 'Ongoing' THEN 2 " +
                "WHEN 'Completed' THEN 3 " +
                "ELSE 0 END)::integer; END IF; END $$;");

            // ------------------------------------------

            migrationBuilder.CreateTable(
                name: "TournamentPlayers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TournamentId = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    Seed = table.Column<int>(type: "integer", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentPlayers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TournamentPlayers_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TournamentPlayers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TournamentStages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TournamentId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SequenceOrder = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Settings = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentStages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TournamentStages_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TournamentGroups",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    StageId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ParticipantIds = table.Column<List<string>>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TournamentGroups_TournamentStages_StageId",
                        column: x => x.StageId,
                        principalTable: "TournamentStages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Matches_StageId",
                table: "Matches",
                column: "StageId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentGroups_StageId",
                table: "TournamentGroups",
                column: "StageId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentPlayers_TournamentId",
                table: "TournamentPlayers",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentPlayers_UserId",
                table: "TournamentPlayers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentStages_TournamentId",
                table: "TournamentStages",
                column: "TournamentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_TournamentStages_StageId",
                table: "Matches",
                column: "StageId",
                principalTable: "TournamentStages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_TournamentStages_StageId",
                table: "Matches");

            migrationBuilder.DropTable(
                name: "TournamentGroups");

            migrationBuilder.DropTable(
                name: "TournamentPlayers");

            migrationBuilder.DropTable(
                name: "TournamentStages");

            migrationBuilder.DropIndex(
                name: "IX_Matches_StageId",
                table: "Matches");

            migrationBuilder.DropColumn(
                name: "StageId",
                table: "Matches");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.AddColumn<List<string>>(
                name: "RegisteredPlayerIds",
                table: "Tournaments",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "SetupProperties",
                table: "Tournaments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Dictionary<string, string>>(
                name: "SetupPropertiesMap",
                table: "Tournaments",
                type: "hstore",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tournaments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
