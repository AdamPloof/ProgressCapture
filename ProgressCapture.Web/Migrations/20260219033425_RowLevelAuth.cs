using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProgressCapture.Web.Migrations
{
    /// <inheritdoc />
    public partial class RowLevelAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "app_user_id",
                table: "goal",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "ix_goal_app_user_id",
                table: "goal",
                column: "app_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_goal_asp_net_users_app_user_id",
                table: "goal",
                column: "app_user_id",
                principalTable: "asp_net_users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_goal_asp_net_users_app_user_id",
                table: "goal");

            migrationBuilder.DropIndex(
                name: "ix_goal_app_user_id",
                table: "goal");

            migrationBuilder.DropColumn(
                name: "app_user_id",
                table: "goal");
        }
    }
}
