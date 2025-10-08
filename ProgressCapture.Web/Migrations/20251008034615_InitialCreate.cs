using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressCapture.Web.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "goal",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_goal", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "unit_of_measure",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", nullable: false),
                    short_name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_unit_of_measure", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "progress_type",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "TEXT", maxLength: 512, nullable: true),
                    target = table.Column<int>(type: "INTEGER", nullable: false),
                    goal_id = table.Column<int>(type: "INTEGER", nullable: false),
                    unit_of_measure_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_progress_type", x => x.id);
                    table.ForeignKey(
                        name: "fk_progress_type_goal_goal_id",
                        column: x => x.goal_id,
                        principalTable: "goal",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_progress_type_unit_of_measure_unit_of_measure_id",
                        column: x => x.unit_of_measure_id,
                        principalTable: "unit_of_measure",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "progress_entry",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    date = table.Column<DateTime>(type: "TEXT", nullable: true),
                    amount = table.Column<int>(type: "INTEGER", nullable: false),
                    notes = table.Column<string>(type: "TEXT", maxLength: 1024, nullable: true),
                    progress_type_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_progress_entry", x => x.id);
                    table.ForeignKey(
                        name: "fk_progress_entry_progress_type_progress_type_id",
                        column: x => x.progress_type_id,
                        principalTable: "progress_type",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_progress_entry_progress_type_id",
                table: "progress_entry",
                column: "progress_type_id");

            migrationBuilder.CreateIndex(
                name: "ix_progress_type_goal_id",
                table: "progress_type",
                column: "goal_id");

            migrationBuilder.CreateIndex(
                name: "ix_progress_type_unit_of_measure_id",
                table: "progress_type",
                column: "unit_of_measure_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "progress_entry");

            migrationBuilder.DropTable(
                name: "progress_type");

            migrationBuilder.DropTable(
                name: "goal");

            migrationBuilder.DropTable(
                name: "unit_of_measure");
        }
    }
}
