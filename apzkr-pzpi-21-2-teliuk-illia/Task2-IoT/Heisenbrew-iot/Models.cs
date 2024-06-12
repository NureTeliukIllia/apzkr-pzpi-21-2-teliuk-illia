namespace Heisenbrew_iot
{
    public class Brewing
    {
        public Guid Id { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public ICollection<BrewingLog> BrewingLogs { get; set; }
        public Status Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }   
    
    public class BrewingLog
    {
        public BrewingLogCode StatusCode { get; set; }
        public string Message { get; set; }
        public DateTime LogTime { get; set; }
    }

    public class Recipe
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<RecipeIngredient> Ingredients { get; set; }
    }

    public class RecipeIngredient
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Weight { get; set; }
    }

    public enum BrewingLogCode
    {
        Info,
        Warning,
        CriticalError
    }

    public enum Status
    {
        Started,
        Filling,
        Processing,
        Finished,
        Failed,
        Aborted
    }
}
