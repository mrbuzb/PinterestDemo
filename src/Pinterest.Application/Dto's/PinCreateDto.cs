using Microsoft.AspNetCore.Http;

namespace Pinterest.Application.Dto_s;

public class PinCreateDto
{
    public string Title { get; set; }
    public IFormFile Image { get; set; }
    public string Description { get; set; }
}
