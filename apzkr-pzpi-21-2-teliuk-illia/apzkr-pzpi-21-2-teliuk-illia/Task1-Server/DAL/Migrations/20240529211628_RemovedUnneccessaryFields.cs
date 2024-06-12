using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class RemovedUnneccessaryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "BrewingEquipment");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a18be9c0-aa65-4af8-bd17-00bd9344e575",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "bf4d1716-eff2-475e-94d5-4562e6c9c915", "AQAAAAIAAYagAAAAEEe/m6Np+riXaXAjCg8fWpqufOULBsG0Bf4e21QO1d001cmvg0l5Xo9XzCSyVcZ9cQ==" });

            migrationBuilder.UpdateData(
                table: "Brewers",
                keyColumn: "Id",
                keyValue: new Guid("a18be9c0-aa65-4af8-bd17-00bd9344e575"),
                column: "CreatedAt",
                value: new DateTime(2024, 5, 29, 21, 16, 27, 695, DateTimeKind.Utc).AddTicks(7995));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
                table: "Ingredients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
                table: "BrewingEquipment",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "a18be9c0-aa65-4af8-bd17-00bd9344e575",
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "8f0fd67f-ee05-4a11-8b5c-4635961fae49", "AQAAAAIAAYagAAAAEO8Wrv6Vl6gHyF9pC1NwR4v2YrIqmq1c9SIXQj9LrwRLxYsWoASZI0Cee0M0v7iYkQ==" });

            migrationBuilder.UpdateData(
                table: "Brewers",
                keyColumn: "Id",
                keyValue: new Guid("a18be9c0-aa65-4af8-bd17-00bd9344e575"),
                column: "CreatedAt",
                value: new DateTime(2024, 5, 4, 15, 30, 51, 811, DateTimeKind.Utc).AddTicks(4702));
        }
    }
}
